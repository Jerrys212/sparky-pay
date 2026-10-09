"use client";

import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Field } from "./Input";

interface InputGroupProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  label?: ReactNode;
  help?: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  size?: "md" | "lg";
}

export function InputGroup({ id, label, help, prefix, suffix, size = "md", className, ...rest }: InputGroupProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const addon = "flex items-center bg-surface-soft px-[.85rem] py-[.375rem] font-bold text-muted-green";

  return (
    <Field id={inputId} label={label} help={help}>
      <div className="flex items-stretch overflow-hidden rounded-lg border border-text-main/12 bg-card transition-all duration-200 focus-within:border-forest-medium focus-within:ring-3 focus-within:ring-forest-medium/8">
        {prefix && (
          <span className={cn(addon, "border-r border-text-main/8", size === "lg" && "text-[1.1rem]")}>{prefix}</span>
        )}
        <input
          id={inputId}
          className={cn(
            "min-w-0 flex-1 border-0 bg-transparent px-4 text-text-main tabular-nums outline-none",
            size === "lg"
              ? "py-[.6rem] text-2xl font-extrabold tracking-[-0.02em]"
              : "py-[.7rem] text-[.9rem] font-semibold",
            className,
          )}
          {...rest}
        />
        {suffix && <span className={cn(addon, "border-l border-text-main/8 text-[.8rem]")}>{suffix}</span>}
      </div>
    </Field>
  );
}

export default InputGroup;
