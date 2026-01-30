"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type InputProps = {
  label: string;
  hint?: string;
  error?: string;
  rightSlot?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, rightSlot, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const describedBy = error
      ? `${inputId}-error`
      : hint
        ? `${inputId}-hint`
        : undefined;

    return (
      <div className="w-full">
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-[13px] font-semibold text-zinc-900"
        >
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            aria-describedby={describedBy}
            aria-invalid={Boolean(error) || undefined}
            className={cn(
              "h-12 w-full rounded-2xl border bg-white px-4 text-[15px] text-zinc-900 shadow-sm outline-none transition",
              "placeholder:text-zinc-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-200/55",
              error
                ? "border-red-300 focus:border-red-400 focus:ring-red-200/50"
                : "border-border",
              rightSlot ? "pr-12" : null,
              className,
            )}
            {...props}
          />
          {rightSlot ? (
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              {rightSlot}
            </div>
          ) : null}
        </div>
        {error ? (
          <p id={`${inputId}-error`} className="mt-1.5 text-[13px] text-red-600">
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="mt-1.5 text-[13px] text-zinc-500">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);
Input.displayName = "Input";

