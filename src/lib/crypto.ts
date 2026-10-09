import { createCipheriv, randomBytes } from "node:crypto";
import { env } from "@/lib/env";

const key = Buffer.from(env.AES_SECRET_KEY, "hex");

export function aesEncrypt(plain: string): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return `${iv.toString("base64")}:${encrypted.toString("base64")}`;
}
