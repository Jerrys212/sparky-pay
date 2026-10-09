"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { ToastInput, ToastVariant } from "@/types";
import { cn } from "@/lib/cn";
import { TOAST_DURATION_MS } from "@/content/mock-data";

const variantStyles: Record<ToastVariant, { border: string; iconBox: string; chip: string; bar: string; icon: string; code: string }> = {
  success: {
    border: "border-l-sys-green",
    iconBox: "bg-sys-green-bg text-sys-green",
    chip: "bg-sys-green-bg text-sys-green-text",
    bar: "bg-sys-green",
    icon: "bi-check-circle-fill",
    code: "200 OK",
  },
  error: {
    border: "border-l-sys-red",
    iconBox: "bg-sys-red-bg text-sys-red",
    chip: "bg-sys-red-bg text-sys-red-text",
    bar: "bg-sys-red",
    icon: "bi-x-octagon-fill",
    code: "400 Bad Request",
  },
};

interface ToastProps extends ToastInput {
  onClose?: () => void;
  duration?: number;
  static?: boolean;
  className?: string;
}

export function Toast({ variant, title, message, onClose, duration = TOAST_DURATION_MS, static: isStatic, className }: ToastProps) {
  const styles = variantStyles[variant];
  return (
    <div
      role={isStatic ? undefined : variant === "error" ? "alert" : "status"}
      className={cn(
        "pointer-events-auto relative flex w-full items-start gap-[.85rem] overflow-hidden rounded-lg border border-l-4 border-border-light bg-card px-[1.1rem] py-4 shadow-lg md:w-[360px]",
        !isStatic && "animate-toast-in",
        styles.border,
        className,
      )}
    >
      <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-full text-[1.05rem]", styles.iconBox)}>
        <i className={cn("bi", styles.icon)} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[.9rem] font-bold">{title}</span>
          <span className={cn("rounded-sm px-[.4rem] py-[.1rem] font-mono text-[.7rem] font-bold", styles.chip)}>{styles.code}</span>
        </div>
        <p className="mt-0.5 text-[.8rem] text-muted-green">{message}</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar notificación"
        className="p-0.5 text-[.8rem] text-text-main opacity-50 transition-opacity hover:opacity-100"
      >
        <i className="bi bi-x-lg" aria-hidden="true" />
      </button>
      <span
        aria-hidden="true"
        className={cn("absolute bottom-0 left-0 h-[3px]", styles.bar, isStatic ? "w-[62%] opacity-35" : "animate-toast-bar")}
        style={isStatic ? undefined : { animationDuration: `${duration}ms` }}
      />
    </div>
  );
}

interface ToastEntry extends ToastInput {
  id: number;
}

interface ToastContextValue {
  show: (toast: ToastInput) => void;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children, duration = TOAST_DURATION_MS }: { children: ReactNode; duration?: number }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
  }, []);

  const show = useCallback(
    (toast: ToastInput) => {
      const id = ++nextId.current;
      setToasts((list) => [...list, { ...toast, id }]);
      timers.current.set(id, setTimeout(() => dismiss(id), duration));
    },
    [dismiss, duration],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const value = useMemo(() => ({ show, dismiss }), [show, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed top-4 right-4 left-4 z-[1100] flex flex-col items-end gap-3 md:top-6 md:right-6 md:left-auto"
      >
        {toasts.map((t) => (
          <Toast key={t.id} {...t} duration={duration} onClose={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de ToastProvider");
  return ctx;
}

export default Toast;
