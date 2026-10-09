import { z } from "@/lib/zod";

export const TRANSPORT_CURVE = "prime256v1";
export const TRANSPORT_INFO = "spark-pay-venta";
export const TRANSPORT_TAG_BYTES = 16;

const encryptedField = z.string().regex(/^[A-Za-z0-9+/=]+:[A-Za-z0-9+/=]+$/, "Dato cifrado inválido");

export const EncryptedCardSchema = z.object({
  llavePublica: z.string().min(1).max(200),
  numeroTarjeta: encryptedField,
  fechaExpiracion: encryptedField,
  cvv: encryptedField,
});

export type EncryptedCard = z.infer<typeof EncryptedCardSchema>;
