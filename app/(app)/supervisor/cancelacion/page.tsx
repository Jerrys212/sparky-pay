import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ReversalForm } from "@/features/reversal/reversal-form";
import { reversalConfigs } from "@/content/mock-data";

export const metadata: Metadata = { title: "Cancelación" };

export default function Page() {
  const config = reversalConfigs.cancelacion;
  return (
    <>
      <PageHeader
        title={config.label}
        subtitle={config.subtitle}
        breadcrumb={{ homeHref: "/supervisor", current: config.label }}
      />
      <ReversalForm type="cancelacion" configs={reversalConfigs} />
    </>
  );
}
