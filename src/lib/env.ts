import { z } from "zod";

const EnvSchema = z.object({
  BACKEND_URL: z.url(),
  AES_SECRET_KEY: z.string().regex(/^[0-9a-fA-F]{64}$/, "AES_SECRET_KEY debe ser 64 caracteres hex (32 bytes)"),
});

const parsed = EnvSchema.safeParse({
  BACKEND_URL: process.env.BACKEND_URL,
  AES_SECRET_KEY: process.env.AES_SECRET_KEY,
});

if (!parsed.success) {
  throw new Error(`Variables de entorno inválidas: ${parsed.error.flatten().fieldErrors ? JSON.stringify(parsed.error.flatten().fieldErrors) : parsed.error.message}`);
}

export const env = parsed.data;
