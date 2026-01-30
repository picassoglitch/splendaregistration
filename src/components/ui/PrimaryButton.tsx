"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type CommonProps = {
  variant?: "primary" | "secondary" | "ghost";
  size?: "lg" | "md";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
};

function baseStyles(variant: NonNullable<CommonProps["variant"]>) {
  switch (variant) {
    case "secondary":
      return "bg-white text-zinc-900 ring-1 ring-border hover:bg-zinc-50 active:bg-zinc-100";
    case "ghost":
      return "bg-transparent text-zinc-900 hover:bg-zinc-900/5 active:bg-zinc-900/10";
    default:
      return "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800";
  }
}

function sizeStyles(size: NonNullable<CommonProps["size"]>) {
  return size === "lg"
    ? "h-14 px-5 text-[16px]"
    : "h-12 px-4 text-[15px]";
}

export function PrimaryButton({
  className,
  variant = "primary",
  size = "lg",
  leftIcon,
  rightIcon,
  isLoading,
  ...props
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded-2xl font-semibold shadow-[var(--shadow-card)] transition-transform duration-150 will-change-transform",
        "active:scale-[0.99] active:shadow-[var(--shadow-press)] disabled:opacity-55 disabled:shadow-none",
        baseStyles(variant),
        sizeStyles(size),
        className,
      )}
      disabled={props.disabled || isLoading}
      {...props}
    >
      {leftIcon ? <span className="-ml-0.5">{leftIcon}</span> : null}
      <span className="truncate">{isLoading ? "Cargando…" : props.children}</span>
      {rightIcon ? <span className="-mr-0.5">{rightIcon}</span> : null}
    </button>
  );
}

export function PrimaryLinkButton({
  className,
  variant = "primary",
  size = "lg",
  leftIcon,
  rightIcon,
  href,
  ...props
}: CommonProps & Omit<React.ComponentProps<typeof Link>, "href"> & { href: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded-2xl font-semibold shadow-[var(--shadow-card)] transition-transform duration-150 will-change-transform",
        "active:scale-[0.99] active:shadow-[var(--shadow-press)]",
        baseStyles(variant),
        sizeStyles(size),
        className,
      )}
      {...props}
    >
      {leftIcon ? <span className="-ml-0.5">{leftIcon}</span> : null}
      <span className="truncate">{props.children}</span>
      {rightIcon ? <span className="-mr-0.5">{rightIcon}</span> : null}
    </Link>
  );
}

