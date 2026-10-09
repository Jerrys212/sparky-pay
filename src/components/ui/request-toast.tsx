"use client";

import { useEffect, useRef } from "react";
import type { ToastInput } from "@/types";
import { useToast } from "@/components/ui/toast";

interface RequestToastProps extends ToastInput {
  clearQuery?: boolean;
}

export function RequestToast({ variant, title, message, clearQuery }: RequestToastProps) {
  const shown = useRef(false);
  const { show } = useToast();

  useEffect(() => {
    if (shown.current) return;
    shown.current = true;
    show({ variant, title, message });
    if (clearQuery) window.history.replaceState(null, "", window.location.pathname);
  }, [show, variant, title, message, clearQuery]);

  return null;
}

export default RequestToast;
