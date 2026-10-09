import type { Metadata } from "next";
import Link from "next/link";
import type { BadgeVariant } from "@/types";
import { Badge, RoleBadge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { Input } from "@/components/Input";
import { InputGroup } from "@/components/InputGroup";
import { ResultCard } from "@/components/ResultCard";
import { TableSkeleton } from "@/components/TableSkeleton";
import { Toast } from "@/components/Toast";
import { ToastDemoButtons } from "@/components/ToastDemoButtons";
import { sampleCancelReceipt, sampleSaleReceipt, toastMessages } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Sistema visual" };

const statusBadges: BadgeVariant[] = ["Aprobada", "Aplicado", "Pendiente", "Rechazada"];
const typeBadges: BadgeVariant[] = ["Venta", "Cancelación", "Devolución"];

export default function EstadosPage() {
  return (
    <div className="mx-auto flex max-w-[1100px] flex-col gap-6 px-4 py-10 sm:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-[.35rem] flex items-center gap-2 text-[.8rem] font-bold text-forest-medium">
            <i className="bi bi-asterisk" aria-hidden="true" />
            Revisión de diseño
          </div>
          <h1 className="text-[1.75rem]">Sistema visual · Spark Pay</h1>
        </div>
        <Link href="/login" className="text-[.85rem] font-bold text-forest-medium hover:text-forest-light">
          Ir al login →
        </Link>
      </div>

      <Card as="section" title="Notificaciones" subtitle="Respuestas HTTP 200 y 400." action={<ToastDemoButtons success={toastMessages.genericSuccess} error={toastMessages.saleError} />}>
        <div className="flex flex-wrap gap-4">
          <Toast {...toastMessages.genericSuccess} static className="max-w-full md:w-[360px]" />
          <Toast {...toastMessages.saleError} static className="max-w-full md:w-[360px]" />
        </div>
      </Card>

      <Card as="section" title="Botones">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3">
            <Button icon="bi-check2">Primary</Button>
            <Button variant="secondary" icon="bi-lightning-charge">Secondary</Button>
            <Button variant="light" icon="bi-printer">Light</Button>
            <Button variant="danger" icon="bi-x-circle">Danger</Button>
            <Button variant="outline-primary" icon="bi-arrow-right">Outline primary</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Pequeño</Button>
            <Button>Mediano</Button>
            <Button size="lg">Grande</Button>
            <span aria-hidden="true" className="mx-2 h-7 w-px bg-border-light" />
            <Button disabled>Deshabilitado</Button>
            <Button loading>Procesar</Button>
            <Button variant="light" loading>Procesar</Button>
          </div>
        </div>
      </Card>

      <Card as="section" title="Inputs">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
          <Input id="st-normal" label="Normal" placeholder="Escribe aquí" help="Texto de ayuda." />
          <Input id="st-icon" label="Con icono" icon="bi-person" placeholder="Nombre del titular" />
          <Input id="st-focus" label="Focus" icon="bi-credit-card" state="focus" defaultValue="4152 3100 2233 7781" readOnly numeric />
          <Input id="st-disabled" label="Deshabilitado" defaultValue="90817263" disabled />
          <Input id="st-error" label="Error" icon="bi-hash" state="error" defaultValue="9081" error="La referencia debe tener 8 dígitos." />
          <InputGroup id="st-group" label="Input group" prefix="$" suffix="MXN" placeholder="0.00" />
        </div>
      </Card>

      <Card as="section" title="Badges">
        <div className="grid grid-cols-[120px_1fr] items-center gap-4 text-[.8rem] font-semibold text-muted-green">
          <span>Estatus</span>
          <div className="flex flex-wrap gap-2">
            {statusBadges.map((b) => (
              <Badge key={b} variant={b} />
            ))}
          </div>
          <span>Tipo</span>
          <div className="flex flex-wrap gap-2">
            {typeBadges.map((b) => (
              <Badge key={b} variant={b} />
            ))}
          </div>
          <span>Rol</span>
          <div className="flex flex-wrap items-center gap-2">
            <RoleBadge role="operador" />
            <RoleBadge role="supervisor" />
            <span className="inline-flex gap-2 rounded-full bg-forest-dark p-[.4rem]">
              <RoleBadge role="operador" dark size="sm" />
              <RoleBadge role="supervisor" dark size="sm" />
            </span>
          </div>
        </div>
      </Card>

      <section className="rounded-xxl border border-border-light bg-canvas p-7">
        <h2 className="mb-5 text-[1.1rem]">Comprobantes</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-6">
          <ResultCard {...sampleSaleReceipt} primaryLabel="Nueva venta" />
          <ResultCard {...sampleCancelReceipt} primaryLabel="Nueva operación" />
        </div>
      </section>

      <Card as="section" title="Tabla">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-6">
          <div className="overflow-hidden rounded-xl border border-text-main/6">
            <div className="bg-surface-soft px-5 py-[.85rem] text-xs font-bold tracking-[.05em] text-muted-green uppercase">
              Cargando
            </div>
            <TableSkeleton />
          </div>
          <div className="flex items-center justify-center rounded-xl border border-text-main/6">
            <EmptyState title="Sin transacciones" description="Aún no hay transacciones aprobadas para mostrar." />
          </div>
        </div>
      </Card>
    </div>
  );
}
