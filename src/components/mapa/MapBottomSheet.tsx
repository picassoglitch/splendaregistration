"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/cn";

export function MapBottomSheet({
  open,
  onOpenChange,
  title,
  category,
  description,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  category: string;
  description: string;
}) {
  const startY = useRef<number | null>(null);
  const [dragY, setDragY] = useState(0);

  const handleOpenChange = (o: boolean) => {
    if (!o) setDragY(0);
    onOpenChange(o);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    startY.current = e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (startY.current == null) return;
    const dy = Math.max(0, e.clientY - startY.current);
    setDragY(dy);
  };
  const onPointerUp = () => {
    const dy = dragY;
    startY.current = null;
    if (dy > 90) handleOpenChange(false);
    else setDragY(0);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/35 backdrop-blur-[2px]" />
        <Dialog.Content
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 w-full",
            "md:left-1/2 md:max-w-[430px] md:-translate-x-1/2",
            "rounded-t-[28px] bg-white shadow-2xl ring-1 ring-black/10",
          )}
          style={{ transform: dragY ? `translateY(${dragY}px)` : undefined, touchAction: "none" }}
        >
          <div
            className="px-4 pt-3"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            <div className="mx-auto h-1.5 w-12 rounded-full bg-zinc-200" />
          </div>

          <div className="flex items-start justify-between gap-4 px-4 pt-4">
            <div className="min-w-0">
              <Dialog.Title className="text-[16px] font-extrabold text-zinc-900">
                {title}
              </Dialog.Title>
              {category ? (
                <div className="mt-1 text-[12px] font-semibold text-zinc-500">{category}</div>
              ) : null}
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Cerrar"
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl hover:bg-zinc-900/5 active:bg-zinc-900/10"
              >
                <X className="h-5 w-5 text-zinc-900" />
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Description className="px-4 pb-6 pt-3 text-[13px] font-semibold leading-5 text-zinc-700">
            {description}
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

