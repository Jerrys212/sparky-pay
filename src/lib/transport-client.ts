import type { EncryptedCard } from "@/lib/transport";
import { TRANSPORT_INFO } from "@/lib/transport";

const toBase64 = (buffer: ArrayBuffer | Uint8Array) =>
  btoa(String.fromCharCode(...new Uint8Array(buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer))));

const fromBase64 = (value: string) => Uint8Array.from(atob(value), (c) => c.charCodeAt(0));

let serverKey: Promise<CryptoKey> | null = null;

function getServerKey(): Promise<CryptoKey> {
  serverKey ??= fetch("/api/cifrado/llave")
    .then((res) => {
      if (!res.ok) throw new Error("No se pudo obtener la llave de cifrado");
      return res.json() as Promise<{ llavePublica: string }>;
    })
    .then(({ llavePublica }) =>
      crypto.subtle.importKey("raw", fromBase64(llavePublica), { name: "ECDH", namedCurve: "P-256" }, false, []),
    )
    .catch((error: unknown) => {
      serverKey = null;
      throw error;
    });
  return serverKey;
}

export async function encryptCard(fields: Omit<EncryptedCard, "llavePublica">): Promise<EncryptedCard> {
  const server = await getServerKey();
  const ephemeral = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, false, ["deriveBits"]);
  const shared = await crypto.subtle.deriveBits({ name: "ECDH", public: server }, ephemeral.privateKey, 256);
  const hkdf = await crypto.subtle.importKey("raw", shared, "HKDF", false, ["deriveKey"]);
  const aesKey = await crypto.subtle.deriveKey(
    { name: "HKDF", hash: "SHA-256", salt: new Uint8Array(0), info: new TextEncoder().encode(TRANSPORT_INFO) },
    hkdf,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"],
  );

  const encrypt = async (plain: string) => {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const data = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, aesKey, new TextEncoder().encode(plain));
    return `${toBase64(iv)}:${toBase64(data)}`;
  };

  return {
    llavePublica: toBase64(await crypto.subtle.exportKey("raw", ephemeral.publicKey)),
    numeroTarjeta: await encrypt(fields.numeroTarjeta),
    fechaExpiracion: await encrypt(fields.fechaExpiracion),
    cvv: await encrypt(fields.cvv),
  };
}
