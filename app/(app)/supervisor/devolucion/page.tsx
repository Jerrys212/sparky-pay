import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ReversalForm } from "@/features/reversal/reversal-form";
import { MOCK_LATENCY_MS, reversalConfigs, reversalResult, toastMessages } from "@/content/mock-data";

export const metadata: Metadata = { title: "Devolución" };

export default function Page() {
  const config = reversalConfigs.devolucion;
  return (
    <>
      <PageHeader
        title={config.label}
        subtitle={config.subtitle}
        breadcrumb={{ homeHref: "/supervisor", current: config.label }}
      />
      <ReversalForm
        type="devolucion"
        configs={reversalConfigs}
        mockResult={reversalResult}
        successToast={toastMessages.reversalSuccess(config.label)}
        errorToast={toastMessages.reversalError}
        latency={MOCK_LATENCY_MS}
      />
    </>
  );
}
