"use client";

import { useState } from "react";
import type { OperationResult, ToastInput } from "@/types";
import { formatDateTime, formatLongDateTime, formatMoney } from "@/lib/format";
import { useSimulatedRequest } from "@/lib/use-simulated-request";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardPreview } from "@/features/venta/card-preview";
import { Input } from "@/components/ui/input";
import { InputGroup } from "@/components/ui/input-group";
import { ResultCard } from "@/components/ui/result-card";
import { useToast } from "@/components/ui/toast";

export interface SaleMockResult {
  aprobacion: string;
  referencia: string;
  tarjeta: string;
  titular: string;
  importe: number;
}

interface SaleFormProps {
  mockResult: SaleMockResult;
  successToast: ToastInput;
  errorToast: ToastInput;
  latency: number;
}

const emptyForm = { amount: "", name: "", card: "", exp: "" };

const parseAmount = (value: string) => Number.parseFloat(value.replace(/,/g, "")) || 0;

const maskTyped = (value: string, fallback: string) => {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8 ? `${digits.slice(0, 4)} ****** ${digits.slice(-4)}` : fallback;
};

export function SaleForm({ mockResult, successToast, errorToast, latency }: SaleFormProps) {
  const [form, setForm] = useState(emptyForm);
  const [result, setResult] = useState<OperationResult | null>(null);
  const { loading, run } = useSimulatedRequest(latency);
  const toast = useToast();

  const bind = (key: keyof typeof emptyForm) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const amount = parseAmount(form.amount);

  const process = () =>
    run(() => {
      const now = new Date();
      setResult({
        title: "Venta aprobada",
        date: formatLongDateTime(now),
        rows: [
          { label: "No. de aprobación", value: mockResult.aprobacion },
          { label: "Referencia financiera", value: mockResult.referencia },
          { label: "Tarjeta", value: maskTyped(form.card, mockResult.tarjeta) },
          { label: "Titular", value: form.name.trim() || mockResult.titular },
          { label: "Importe", value: formatMoney(amount || mockResult.importe) },
          { label: "Fecha", value: formatDateTime(now) },
        ],
      });
      toast.show(successToast);
    });

  const reset = () => {
    setResult(null);
    setForm(emptyForm);
  };

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
      <Card>
        <div className="mb-6">
          <h2 className="text-[1.1rem]">Datos de la venta</h2>
          <p className="mt-0.5 text-[.8rem] text-muted-green">Todos los campos son obligatorios.</p>
        </div>
        <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()} noValidate>
          <InputGroup id="sale-amount" label="Importe" prefix="$" suffix="MXN" size="lg" inputMode="decimal" placeholder="0.00" {...bind("amount")} />
          <Input id="sale-name" label="Nombre del titular" icon="bi-person" placeholder="Como aparece en la tarjeta" autoComplete="cc-name" {...bind("name")} />
          <Input
            id="sale-card"
            label="Número de tarjeta"
            icon="bi-credit-card"
            placeholder="0000 0000 0000 0000"
            inputMode="numeric"
            autoComplete="cc-number"
            numeric
            trailing={<i className="bi bi-credit-card-2-back" />}
            {...bind("card")}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input id="sale-exp" label="Vencimiento" icon="bi-calendar-event" placeholder="MM/AA" inputMode="numeric" autoComplete="cc-exp" numeric {...bind("exp")} />
            <Input
              id="sale-cvv"
              label="CVV"
              icon="bi-lock"
              placeholder="•••"
              inputMode="numeric"
              autoComplete="cc-csc"
              revealable
              revealLabels={["Mostrar CVV", "Ocultar CVV"]}
            />
          </div>
          <div className="flex items-start gap-[.65rem] rounded-lg bg-surface-soft px-4 py-[.85rem] text-[.8rem] text-text-main">
            <i className="bi bi-shield-lock-fill text-base leading-[1.2] text-sys-green" aria-hidden="true" />
            <span>
              <strong className="font-bold">Datos protegidos.</strong>{" "}
              <span className="text-muted-green">El número de tarjeta, vencimiento y CVV se envían cifrados.</span>
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <Button size="lg" fullWidth iconRight="bi-arrow-right" loading={loading} onClick={process}>
              Procesar venta
            </Button>
            <div className="flex justify-center">
              <Button variant="light" size="sm" icon="bi-bug" onClick={() => toast.show(errorToast)}>
                Simular error
              </Button>
            </div>
          </div>
        </form>
      </Card>

      <div className="flex flex-col gap-6 lg:sticky lg:top-24">
        {result ? (
          <ResultCard {...result} primaryLabel="Nueva venta" onPrimary={reset} />
        ) : (
          <>
            <CardPreview number={form.card} holder={form.name} expiry={form.exp} />
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
