"use client";

import { useEffect, useRef } from "react";
import type { ToastInput } from "@/types";
import { useToast } from "@/components/ui/toast";

export function RequestToast({ variant, title, message }: ToastInput) {
  const shown = useRef(false);
  const { show } = useToast();

  useEffect(() => {
    if (shown.current) return;
    shown.current = true;
    show({ variant, title, message });
  }, [show, variant, title, message]);

  return null;
}

export default RequestToast;
