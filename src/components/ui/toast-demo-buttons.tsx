"use client";

import type { ToastInput } from "@/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function ToastDemoButtons({ success, error }: { success: ToastInput; error: ToastInput }) {
  const toast = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" icon="bi-play-fill" onClick={() => toast.show(success)}>
        Disparar 200
      </Button>
      <Button size="sm" variant="danger" icon="bi-play-fill" onClick={() => toast.show(error)}>
        Disparar 400
      </Button>
    </div>
  );
}

export default ToastDemoButtons;
