"use client";

import { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { OperationResult, ReversalConfig, ReversalType } from "@/types";
import { formatDateTime } from "@/lib/format";
import { digitsOnly, formatCardNumber } from "@/lib/input-format";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { ResultCard } from "@/components/ui/result-card";
import { Tabs } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { ReversalSchema, type ReversalValues } from "@/features/reversal/schema";

interface ReversalFormProps {
  type: ReversalType;
  configs: Record<ReversalType, ReversalConfig>;
}

const toneByType: Record<ReversalType, { button: "danger" | "primary"; modalIcon: string }> = {
  cancelacion: { button: "danger", modalIcon: "bg-sys-red-bg text-sys-red" },
  devolucion: { button: "primary", modalIcon: "bg-sys-orange-bg text-forest-medium" },
};

const maskCard = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8 ? `${digits.slice(0, 4)} ****** ${digits.slice(-4)}` : digits || "—";
};

export function ReversalForm({ type, configs }: ReversalFormProps) {
  const config = configs[type];
  const tone = toneByType[type];
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OperationResult | null>(null);
  const toast = useToast();
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    reset: resetForm,
    formState: { errors },
  } = useForm<ReversalValues>({
    resolver: zodResolver(ReversalSchema),
    defaultValues: { referenciaFinanciera: "", numeroTarjeta: "" },
  });

  const closeModal = useCallback(() => setModalOpen(false), []);
  const openConfirm = handleSubmit(() => setModalOpen(true));

  const confirm = async () => {
    setModalOpen(false);
    setLoading(true);
    try {
      const res = await fetch(`/api/transacciones/${type}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(getValues()),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        const d = data.data;
        setResult({
          title: `${config.label} aplicada`,
          date: formatDateTime(new Date(d.fecha)),
          rows: [
            { label: "No. de aprobación", value: d.numeroAprobacion },
            { label: "Referencia financiera", value: d.referenciaFinanciera },
            { label: "Tarjeta", value: d.tarjeta },
            { label: "Estatus", badge: "Aplicado" },
          ],
        });
        toast.show({
          variant: "success",
          title: `${config.label} aplicada`,
          message: data.mensaje ?? "La operación se aplicó correctamente.",
        });
        return;
      }

      toast.show({
        variant: "error",
        title: "No se pudo completar",
        message: data.mensaje ?? "No se encontró una venta con esa referencia.",
      });
    } catch {
      toast.show({
        variant: "error",
        title: "Error de conexión",
        message: "No pudimos conectar con el servidor. Inténtalo de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    resetForm({ referenciaFinanciera: "", numeroTarjeta: "" });
  };

  return (
    <div className="flex flex-col gap-6">
      <Tabs
        label="Tipo de operación"
        items={(Object.keys(configs) as ReversalType[]).map((key) => ({
          label: configs[key].label,
          icon: configs[key].icon,
          href: `/supervisor/${key}`,
          active: key === type,
        }))}
      />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <Card>
          <div className="mb-6">
            <h2 className="text-[1.1rem]">Datos de la operación original</h2>
            <p className="mt-0.5 text-[.8rem] text-muted-green">Usa los datos del comprobante de venta.</p>
          </div>
          <form className="flex flex-col gap-5" onSubmit={openConfirm} noValidate>
            <Input
              id="rev-ref"
              label="Número de referencia financiera"
              icon="bi-hash"
              placeholder="8 dígitos"
              inputMode="numeric"
              maxLength={8}
              format={digitsOnly(8)}
              numeric
              help="Lo encuentras en el comprobante de la venta."
              error={errors.referenciaFinanciera?.message}
              {...register("referenciaFinanciera")}
            />
            <Input
              id="rev-card"
              label="Número de tarjeta"
              icon="bi-credit-card"
              placeholder="0000 0000 0000 0000"
              inputMode="numeric"
              autoComplete="cc-number"
              maxLength={19}
              format={formatCardNumber}
              numeric
              error={errors.numeroTarjeta?.message}
              {...register("numeroTarjeta")}
            />
            <Button variant={tone.button} size="lg" fullWidth icon={config.icon} type="submit" loading={loading}>
              {config.buttonLabel}
            </Button>
          </form>
        </Card>

        <div className="lg:sticky lg:top-24">
          {result ? (
            <ResultCard {...result} primaryLabel="Nueva operación" onPrimary={reset} />
          ) : (
            <Card title={`¿Cuándo usar ${config.lower}?`}>
              <ul className="flex flex-col gap-[.85rem]">
                {config.points.map((point) => (
                  <li key={point} className="flex items-start gap-[.65rem] text-[.85rem]">
                    <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-lime-translucent text-[.85rem] text-forest-medium">
                      <i className="bi bi-check2" aria-hidden="true" />
                    </span>
                    <span className="text-text-main">{point}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center gap-[.6rem] rounded-lg bg-sys-orange-bg px-4 py-[.85rem] text-[.8rem] font-semibold text-sys-orange-deep">
                <i className="bi bi-exclamation-triangle-fill text-sys-orange" aria-hidden="true" />
                Esta acción no se puede deshacer.
              </div>
            </Card>
          )}
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        icon={config.icon}
        iconClassName={tone.modalIcon}
        title={`¿Confirmar ${config.lower}?`}
        description="Revisa los datos antes de continuar."
        footer={
          <>
            <Button variant="light" onClick={closeModal}>
              Cancelar
            </Button>
            <Button variant={tone.button} icon="bi-check2" onClick={confirm}>
              Sí, aplicar
            </Button>
          </>
        }
      >
        <dl className="flex flex-col gap-2 rounded-lg bg-canvas px-4 py-[.85rem] text-[.85rem] tabular-nums">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-green">Referencia</dt>
            <dd className="font-bold">{watch("referenciaFinanciera") || "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-green">Tarjeta</dt>
            <dd className="font-bold">{maskCard(watch("numeroTarjeta"))}</dd>
          </div>
        </dl>
      </Modal>
    </div>
  );
}

export default ReversalForm;
