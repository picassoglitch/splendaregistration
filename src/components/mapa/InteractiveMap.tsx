/* eslint-disable @next/next/no-img-element */
"use client";

import { TransformComponent, TransformWrapper, type ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { MapPin } from "@/components/mapa/MapPin";

export type MapLocation = {
  key: string; // unique per pin instance (map has duplicate numbers)
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
  selectedId: string | null;
  onPinClick: (key: string) => void;
  apiRef?: React.MutableRefObject<{ centerOn: (x: number, y: number) => void } | null>;
}) {
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [src, setSrc] = useState(imageSrc);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSrc(imageSrc);
    setFailed(false);
  }, [imageSrc]);

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
        "relative w-full bg-white",
      )}
      // Avoid large blank areas; size the map viewport to the screen.
      // Users can still zoom/pan to see details.
      style={{ height: "min(72dvh, 860px)" }}
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
              src={src}
              alt="Mapa del evento"
              className="absolute inset-0 h-full w-full object-contain"
              draggable={false}
              onError={() => setFailed(true)}
            />

            <div className="absolute inset-0">
              {pins.map((p) => (
                <MapPin
                  key={p.key}
                  id={p.id}
                  x={p.x}
                  y={p.y}
                  active={selectedId === p.key}
                  onClick={() => onPinClick(p.key)}
                />
              ))}
            </div>
          </div>
        </TransformComponent>
      </TransformWrapper>

      {failed ? (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="w-full max-w-[360px] rounded-3xl bg-white px-5 py-5 text-center shadow-2xl ring-1 ring-black/10">
            <div className="text-[14px] font-extrabold text-zinc-900">No se pudo cargar el mapa</div>
            <div className="mt-1 text-[12px] font-semibold text-zinc-600">
              Revisa que exista <span className="font-bold">`public/event-map.png`</span>.
            </div>
            <button
              type="button"
              className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-[#173A73] text-[13px] font-extrabold text-white shadow-sm"
              onClick={() => {
                setFailed(false);
                const sep = imageSrc.includes("?") ? "&" : "?";
                setSrc(`${imageSrc}${sep}v=${Date.now()}`);
              }}
            >
              Reintentar
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

