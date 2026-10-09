import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ReversalForm } from "@/components/ReversalForm";
import { MOCK_LATENCY_MS, reversalConfigs, reversalResult, toastMessages } from "@/lib/mock-data";

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
      <ReversalForm
        type="cancelacion"
        configs={reversalConfigs}
        mockResult={reversalResult}
        successToast={toastMessages.reversalSuccess(config.label)}
        errorToast={toastMessages.reversalError}
        latency={MOCK_LATENCY_MS}
      />
    </>
  );
}
