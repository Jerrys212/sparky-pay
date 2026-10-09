import { z } from "@/lib/zod";

export const LoginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Ingresa tu usuario")
    .min(3, "El usuario debe tener al menos 3 caracteres")
    .max(30, "El usuario debe tener máximo 30 caracteres")
    .regex(/^[A-Za-z0-9._-]+$/, "El usuario solo puede contener letras, números, punto, guion y guion bajo"),
  password: z
    .string()
    .min(1, "Ingresa tu contraseña")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(64, "La contraseña debe tener máximo 64 caracteres"),
});

export type LoginInput = z.infer<typeof LoginSchema>;
