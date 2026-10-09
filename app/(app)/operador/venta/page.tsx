import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { SaleForm } from "@/features/venta/sale-form";

export const metadata: Metadata = { title: "Nueva venta" };

export default function VentaPage() {
  return (
    <>
      <PageHeader
        title="Nueva venta"
        subtitle="Captura los datos del cobro con tarjeta."
        breadcrumb={{ homeHref: "/operador", current: "Nueva venta" }}
      />
      <SaleForm />
    </>
  );
}
