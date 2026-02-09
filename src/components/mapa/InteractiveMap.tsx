/* eslint-disable @next/next/no-img-element */
"use client";

import { TransformComponent, TransformWrapper, type ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/cn";
import { MapPin } from "@/components/mapa/MapPin";

export type MapLocation = {
  id: number;
  name: string;
  category: "areas_comunes" | "habitaciones" | "restaurantes";
  x: number;
  y: number;
  description?: string;
};

export function InteractiveMap({
  imageSrc,
  locations,
  selectedId,
  onPinClick,
  apiRef,
}: {
  imageSrc: string;
  locations: MapLocation[];
  selectedId: number | null;
  onPinClick: (id: number) => void;
  apiRef?: React.MutableRefObject<{ centerOn: (x: number, y: number) => void } | null>;
}) {
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const centerOn = (x: number, y: number) => {
    const inst = transformRef.current;
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!inst || !viewport || !content) return;

    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    const cw = content.clientWidth;
    const ch = content.clientHeight;

    const nextScale = Math.max(inst.state.scale, 2);
    const px = x * cw * nextScale;
    const py = y * ch * nextScale;
    const nx = vw / 2 - px;
    const ny = vh / 2 - py;

    inst.setTransform(nx, ny, nextScale, 280, "easeOut");
  };

  useEffect(() => {
    if (!apiRef) return;
    apiRef.current = { centerOn };
    return () => {
      apiRef.current = null;
    };
  }, [apiRef]);

  const pins = useMemo(() => locations, [locations]);

  return (
    <div
      ref={viewportRef}
      className={cn(
        "relative w-full",
        // Keep a tall viewport like the real map (portrait)
        "h-[520px] md:h-[640px]",
        "bg-white",
      )}
    >
      <TransformWrapper
        ref={transformRef}
        minScale={1}
        maxScale={6}
        initialScale={1}
        centerOnInit
        wheel={{ step: 0.08 }}
        doubleClick={{ disabled: true }}
        panning={{ velocityDisabled: true }}
        pinch={{ step: 8 }}
      >
        <TransformComponent
          wrapperClass="!w-full !h-full"
          contentClass="!w-full !h-full"
          wrapperStyle={{ width: "100%", height: "100%", touchAction: "none" }}
        >
          <div ref={contentRef} className="relative w-full h-full select-none">
            <img
              src={imageSrc}
              alt="Mapa del evento"
              className="absolute inset-0 h-full w-full object-contain"
              draggable={false}
            />

            <div className="absolute inset-0">
              {pins.map((p) => (
                <MapPin
                  key={p.id}
                  id={p.id}
                  x={p.x}
                  y={p.y}
                  active={selectedId === p.id}
                  onClick={() => onPinClick(p.id)}
                />
              ))}
            </div>
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}

