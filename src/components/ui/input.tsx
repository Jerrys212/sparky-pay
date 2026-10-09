"use client";

import { useId, useState, type ChangeEvent, type InputHTMLAttributes, type ReactNode, type Ref } from "react";
import { cn } from "@/lib/cn";

export type InputState = "default" | "focus" | "error";

interface FieldProps {
  id: string;
  label?: ReactNode;
  help?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Field({ id, label, help, error, children, className }: FieldProps) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-2 block text-[.85rem] font-bold text-text-main">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="mt-[.35rem] flex items-center gap-[.35rem] text-xs font-bold text-sys-red-strong">
          <i className="bi bi-exclamation-circle-fill" aria-hidden="true" />
          {error}
        </p>
      ) : (
        help && <p className="mt-[.35rem] text-xs text-muted-green">{help}</p>
      )}
    </div>
  );
}

export function withFormat(
  format: ((value: string) => string) | undefined,
  onChange: ((event: ChangeEvent<HTMLInputElement>) => void) | undefined,
) {
  if (!format) return onChange;
  return (event: ChangeEvent<HTMLInputElement>) => {
    const formatted = format(event.target.value);
    if (formatted !== event.target.value) event.target.value = formatted;
    onChange?.(event);
  };
}

export const inputBaseClasses =
  "w-full rounded-lg border border-text-main/12 bg-card py-[.7rem] text-[.9rem] font-medium text-text-main outline-none transition-all duration-200 focus:border-forest-medium focus:ring-3 focus:ring-forest-medium/8 disabled:bg-surface-soft disabled:text-muted-green";

const authInputClasses =
  "w-full rounded-lg border border-border-light bg-canvas py-[.8rem] text-[.9rem] font-medium text-text-main outline-none transition-all duration-200 focus:border-lime focus:bg-card focus:ring-4 focus:ring-lime-translucent";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: ReactNode;
  help?: ReactNode;
  error?: ReactNode;
  icon?: string;
  trailing?: ReactNode;
  state?: InputState;
  revealable?: boolean;
  revealLabels?: [show: string, hide: string];
  numeric?: boolean;
  format?: (value: string) => string;
  tone?: "default" | "auth";
  fieldClassName?: string;
  ref?: Ref<HTMLInputElement>;
}

export function Input({
  id,
  label,
  help,
  error,
  icon,
  trailing,
  state = "default",
  revealable,
  revealLabels = ["Mostrar", "Ocultar"],
  numeric,
  format,
  onChange,
  tone = "default",
  type = "text",
  className,
  fieldClassName,
  ref,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [revealed, setRevealed] = useState(false);
  const isError = state === "error" || Boolean(error);
  const hasTrailing = Boolean(trailing) || revealable;

  return (
    <Field id={inputId} label={label} help={help} error={error} className={fieldClassName}>
      <div className="group/input relative">
        {icon && (
          <i
            aria-hidden="true"
            className={cn(
              "bi pointer-events-none absolute top-1/2 -translate-y-1/2 text-[1.05rem] transition-colors duration-200",
              icon,
              tone === "auth" ? "left-[1.1rem]" : "left-4",
              isError
                ? "text-sys-red"
                : state === "focus"
                  ? "text-forest-medium"
                  : "text-muted-green group-focus-within/input:text-forest-medium",
            )}
          />
        )}
        <input
          id={inputId}
          ref={ref}
          type={revealable ? (revealed ? "text" : "password") : type}
          aria-invalid={isError || undefined}
          className={cn(
            tone === "auth" ? authInputClasses : inputBaseClasses,
            icon ? (tone === "auth" ? "pl-[2.85rem]" : "pl-[2.6rem]") : "pl-4",
            hasTrailing ? (tone === "auth" ? "pr-12" : "pr-[2.8rem]") : tone === "auth" ? "pr-5" : "pr-4",
            numeric && "tabular-nums",
            state === "focus" && "border-forest-medium ring-3 ring-forest-medium/8",
            isError && "border-sys-red ring-3 ring-sys-red/8 focus:border-sys-red focus:ring-sys-red/8",
            className,
          )}
          {...rest}
          onChange={withFormat(format, onChange)}
        />
        {revealable ? (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? revealLabels[1] : revealLabels[0]}
            className={cn(
              "absolute top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md text-[1.05rem] text-muted-green transition-colors hover:text-forest-medium",
              tone === "auth" ? "right-2 size-9" : "right-[.4rem] size-[34px]",
            )}
          >
            <i className={cn("bi", revealed ? "bi-eye-slash" : "bi-eye")} aria-hidden="true" />
          </button>
        ) : (
          trailing && (
            <span aria-hidden="true" className="absolute top-1/2 right-4 flex -translate-y-1/2 text-[1.2rem] text-muted-green">
              {trailing}
            </span>
          )
        )}
      </div>
    </Field>
  );
}

export default Input;
