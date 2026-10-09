import { z } from "@/lib/zod";
import { cardNumberSchema } from "@/lib/card";

export const ReversalSchema = z.object({
  referenciaFinanciera: z
    .string()
    .trim()
    .min(1, "Ingresa la referencia financiera")
    .regex(/^\d+$/, "La referencia solo debe contener dígitos")
    .length(8, "La referencia debe tener 8 dígitos"),
  numeroTarjeta: cardNumberSchema,
});

export type ReversalValues = z.infer<typeof ReversalSchema>;
