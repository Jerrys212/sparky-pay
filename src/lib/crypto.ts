import { createCipheriv, createDecipheriv, createECDH, hkdfSync, randomBytes } from "node:crypto";
import { env } from "@/lib/env";
import { TRANSPORT_CURVE, TRANSPORT_INFO, TRANSPORT_TAG_BYTES } from "@/lib/transport";

const key = Buffer.from(env.AES_SECRET_KEY, "hex");

export function aesEncrypt(plain: string): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return `${iv.toString("base64")}:${encrypted.toString("base64")}`;
}

const transport = createECDH(TRANSPORT_CURVE);
// Derived from the AES secret with its own HKDF label so no extra env var is needed and the keys stay separate.
transport.setPrivateKey(Buffer.from(hkdfSync("sha256", key, Buffer.alloc(0), "spark-pay-transport-ecdh", 32)));

export const transportPublicKey = transport.getPublicKey("base64");

export function createTransportDecrypter(clientPublicKey: string) {
  const shared = transport.computeSecret(Buffer.from(clientPublicKey, "base64"));
  const aesKey = Buffer.from(hkdfSync("sha256", shared, Buffer.alloc(0), TRANSPORT_INFO, 32));

  return (payload: string): string => {
    const [ivB64, dataB64] = payload.split(":");
    if (!ivB64 || !dataB64) throw new Error("Malformed encrypted field");
    const data = Buffer.from(dataB64, "base64");
    const decipher = createDecipheriv("aes-256-gcm", aesKey, Buffer.from(ivB64, "base64"));
    decipher.setAuthTag(data.subarray(data.length - TRANSPORT_TAG_BYTES));
    return Buffer.concat([decipher.update(data.subarray(0, data.length - TRANSPORT_TAG_BYTES)), decipher.final()]).toString("utf8");
  };
}
