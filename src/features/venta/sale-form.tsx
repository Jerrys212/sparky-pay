"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { OperationResult } from "@/types";
import { formatDateTime, formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InputGroup } from "@/components/ui/input-group";
import { ResultCard } from "@/components/ui/result-card";
import { useToast } from "@/components/ui/toast";
import { CardPreview } from "@/features/venta/card-preview";
import { VentaSchema, type VentaValues } from "@/features/venta/schema";

const emptyForm: VentaValues = { importe: "", nombreTitular: "", numeroTarjeta: "", fechaExpiracion: "", cvv: "" };

export function SaleForm() {
  const [result, setResult] = useState<OperationResult | null>(null);
  const toast = useToast();
  const {
    register,
    handleSubmit,
    watch,
    reset: resetForm,
    formState: { errors, isSubmitting },
  } = useForm<VentaValues>({
    resolver: zodResolver(VentaSchema),
    defaultValues: emptyForm,
  });

  const amount = Number(watch("importe")) || 0;

  const submit = handleSubmit(async (values) => {
    try {
      const res = await fetch("/api/transacciones/venta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        const d = data.data;
        setResult({
          title: "Venta aprobada",
          date: formatDateTime(new Date(d.fecha)),
          rows: [
            { label: "No. de aprobación", value: d.numeroAprobacion },
            { label: "Referencia financiera", value: d.referenciaFinanciera },
            { label: "Tarjeta", value: d.tarjeta },
            { label: "Titular", value: d.nombreTitular },
            { label: "Importe", value: formatMoney(d.importe) },
            { label: "Estatus", badge: "Aprobada" },
          ],
        });
        toast.show({ variant: "success", title: "Venta aprobada", message: data.mensaje ?? "La transacción se procesó correctamente." });
        return;
      }

      toast.show({
        variant: "error",
        title: "No se pudo completar",
        message: data.mensaje ?? "Verifica los datos de la tarjeta e inténtalo de nuevo.",
      });
    } catch {
      toast.show({
        variant: "error",
        title: "Error de conexión",
        message: "No pudimos conectar con el servidor. Inténtalo de nuevo.",
      });
    }
  });

  const reset = () => {
    setResult(null);
    resetForm(emptyForm);
  };

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
      <Card>
        <div className="mb-6">
          <h2 className="text-[1.1rem]">Datos de la venta</h2>
          <p className="mt-0.5 text-[.8rem] text-muted-green">Todos los campos son obligatorios.</p>
        </div>
        <form className="flex flex-col gap-5" onSubmit={submit} noValidate>
          <InputGroup
            id="sale-amount"
            label="Importe"
            prefix="$"
            suffix="MXN"
            size="lg"
            inputMode="decimal"
            placeholder="0.00"
            error={errors.importe?.message}
            {...register("importe")}
          />
          <Input
            id="sale-name"
            label="Nombre del titular"
            icon="bi-person"
            placeholder="Como aparece en la tarjeta"
            autoComplete="cc-name"
            error={errors.nombreTitular?.message}
            {...register("nombreTitular")}
          />
          <Input
            id="sale-card"
            label="Número de tarjeta"
            icon="bi-credit-card"
            placeholder="0000 0000 0000 0000"
            inputMode="numeric"
            autoComplete="cc-number"
            numeric
            trailing={<i className="bi bi-credit-card-2-back" />}
            error={errors.numeroTarjeta?.message}
            {...register("numeroTarjeta")}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="sale-exp"
              label="Vencimiento"
              icon="bi-calendar-event"
              placeholder="MM/AA"
              inputMode="numeric"
              autoComplete="cc-exp"
              error={errors.fechaExpiracion?.message}
              {...register("fechaExpiracion")}
            />
            <Input
              id="sale-cvv"
              label="CVV"
              icon="bi-lock"
              placeholder="•••"
              inputMode="numeric"
              autoComplete="cc-csc"
              revealable
              revealLabels={["Mostrar CVV", "Ocultar CVV"]}
              error={errors.cvv?.message}
              {...register("cvv")}
            />
          </div>
          <div className="flex items-start gap-[.65rem] rounded-lg bg-surface-soft px-4 py-[.85rem] text-[.8rem] text-text-main">
            <i className="bi bi-shield-lock-fill text-base leading-[1.2] text-sys-green" aria-hidden="true" />
            <span>
              <strong className="font-bold">Datos protegidos.</strong>{" "}
              <span className="text-muted-green">El número de tarjeta, vencimiento y CVV se envían cifrados con AES.</span>
            </span>
          </div>
          <Button type="submit" size="lg" fullWidth iconRight="bi-arrow-right" loading={isSubmitting}>
            Procesar venta
          </Button>
        </form>
      </Card>

      <div className="flex flex-col gap-6 lg:sticky lg:top-24">
        {result ? (
          <ResultCard {...result} primaryLabel="Nueva venta" onPrimary={reset} />
        ) : (
          <>
            <CardPreview number={watch("numeroTarjeta")} holder={watch("nombreTitular")} expiry={watch("fechaExpiracion")} />
            <Card title="Resumen">
              <div className="flex flex-col gap-[.7rem] text-sm tabular-nums">
                <div className="flex justify-between">
                  <span className="text-muted-green">Importe</span>
                  <span className="font-bold">{formatMoney(amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-green">Comisión</span>
                  <span className="font-bold">{formatMoney(0)}</span>
                </div>
                <div className="my-1 h-px bg-border-light" />
                <div className="flex items-baseline justify-between">
                  <span className="font-bold">Total</span>
                  <span className="text-xl font-extrabold tracking-[-0.02em]">{formatMoney(amount)}</span>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

export default SaleForm;
