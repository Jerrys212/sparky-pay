"use client";

import { useCallback, useState } from "react";
import type { OperationResult, ReversalConfig, ReversalType, ToastInput } from "@/types";
import { formatDateTime, formatLongDateTime } from "@/lib/format";
import { useSimulatedRequest } from "@/lib/use-simulated-request";
import { Button } from "./Button";
import { Card } from "./Card";
import { Input } from "./Input";
import { Modal } from "./Modal";
import { ResultCard } from "./ResultCard";
import { Tabs } from "./Tabs";
import { useToast } from "./Toast";

export interface ReversalMockResult {
  aprobacion: string;
  referencia: string;
  tarjeta: string;
}

interface ReversalFormProps {
  type: ReversalType;
  configs: Record<ReversalType, ReversalConfig>;
  mockResult: ReversalMockResult;
  successToast: ToastInput;
  errorToast: ToastInput;
  latency: number;
}

const toneByType: Record<ReversalType, { button: "danger" | "primary"; modalIcon: string }> = {
  cancelacion: { button: "danger", modalIcon: "bg-sys-red-bg text-sys-red" },
  devolucion: { button: "primary", modalIcon: "bg-sys-orange-bg text-forest-medium" },
};

const digitsOf = (value: string) => value.replace(/\D/g, "");
const maskTyped = (value: string, fallback: string) => {
  const digits = digitsOf(value);
  return digits.length >= 8 ? `${digits.slice(0, 4)} ****** ${digits.slice(-4)}` : fallback;
};

export function ReversalForm({ type, configs, mockResult, successToast, errorToast, latency }: ReversalFormProps) {
  const config = configs[type];
  const tone = toneByType[type];
  const [form, setForm] = useState({ ref: "", card: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [result, setResult] = useState<OperationResult | null>(null);
  const { loading, run } = useSimulatedRequest(latency);
  const toast = useToast();
  const closeModal = useCallback(() => setModalOpen(false), []);

  const reference = digitsOf(form.ref) || mockResult.referencia;
  const card = maskTyped(form.card, mockResult.tarjeta);

  const confirm = () => {
    setModalOpen(false);
    run(() => {
      const now = new Date();
      setResult({
        title: `${config.label} aplicada`,
        date: formatLongDateTime(now),
        rows: [
          { label: "No. de aprobación", value: mockResult.aprobacion },
          { label: "Referencia financiera", value: reference },
          { label: "Tarjeta", value: card },
          { label: "Estatus", badge: "Aplicado" },
          { label: "Fecha", value: formatDateTime(now) },
        ],
      });
      toast.show(successToast);
    });
  };

  const reset = () => {
    setResult(null);
    setForm({ ref: "", card: "" });
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
          <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()} noValidate>
            <Input
              id="rev-ref"
              label="Número de referencia financiera"
              icon="bi-hash"
              placeholder="8 dígitos"
              inputMode="numeric"
              numeric
              help="Lo encuentras en el comprobante de la venta."
              value={form.ref}
              onChange={(e) => setForm((f) => ({ ...f, ref: e.target.value }))}
            />
            <Input
              id="rev-card"
              label="Número de tarjeta"
              icon="bi-credit-card"
              placeholder="0000 0000 0000 0000"
              inputMode="numeric"
              numeric
              value={form.card}
              onChange={(e) => setForm((f) => ({ ...f, card: e.target.value }))}
            />
            <Button
              variant={tone.button}
              size="lg"
              fullWidth
              icon={config.icon}
              loading={loading}
              onClick={() => setModalOpen(true)}
            >
              {config.buttonLabel}
            </Button>
            <div className="flex justify-center">
              <Button variant="light" size="sm" icon="bi-bug" onClick={() => toast.show(errorToast)}>
                Simular error
              </Button>
            </div>
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
            <dd className="font-bold">{reference}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-green">Tarjeta</dt>
            <dd className="font-bold">{card}</dd>
          </div>
        </dl>
      </Modal>
    </div>
  );
}

export default ReversalForm;
