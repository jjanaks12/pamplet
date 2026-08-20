"use client";

import { forwardRef, useRef, type PointerEvent as ReactPointerEvent } from "react";
import type { LayerId, Layers, PhotoTransform, Template } from "@/lib/poster";

type PosterCanvasProps = {
  template: Template | null;
  photo: string | null;
  transform: PhotoTransform;
  name: string;
  position: string;
  layers: Layers;
  selected: LayerId | null;
  onSelect: (id: LayerId | null) => void;
  onLayersChange: (layers: Layers) => void;
};

const deva = { fontFamily: "var(--font-devanagari), sans-serif" } as const;

const PosterCanvas = forwardRef<HTMLDivElement, PosterCanvasProps>(function PosterCanvas(
  { template, photo, transform, name, position, layers, selected, onSelect, onLayersChange },
  ref
) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ id: LayerId; sx: number; sy: number; ox: number; oy: number; w: number } | null>(null);

  const width = template?.width ?? 1080;
  const height = template?.height ?? 1080;

  function setRef(node: HTMLDivElement | null) {
    rootRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  }

  function startDrag(e: ReactPointerEvent<HTMLDivElement>, id: LayerId) {
    e.stopPropagation();
    onSelect(id);
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { id, sx: e.clientX, sy: e.clientY, ox: layers[id].x, oy: layers[id].y, w: rect.width };
  }

  function moveDrag(e: ReactPointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d) return;
    onLayersChange({
      ...layers,
      [d.id]: { ...layers[d.id], x: d.ox + (e.clientX - d.sx) / d.w, y: d.oy + (e.clientY - d.sy) / d.w },
    });
  }

  const px = (fraction: number) => fraction * width;

  function textLayer(id: "name" | "position", value: string, placeholder: string) {
    const l = layers[id];
    return (
      <div
        onPointerDown={(e) => startDrag(e, id)}
        onPointerMove={moveDrag}
        onPointerUp={() => (drag.current = null)}
        style={{
          left: px(l.x),
          top: px(l.y),
          width: px(l.width),
          fontSize: px(l.size),
          color: value ? l.color : `${l.color}b3`,
        }}
        className="absolute cursor-move touch-none text-center font-semibold leading-tight"
      >
        {value || placeholder}
        {selected === id && <Outline />}
      </div>
    );
  }

  return (
    <div
      ref={setRef}
      onPointerDown={() => onSelect(null)}
      style={{ width, height, backgroundColor: "#ffffff", ...deva }}
      className="relative select-none overflow-hidden"
    >
      {template ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={template.src} alt="Poster template" draggable={false} className="absolute inset-0 h-full w-full" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center border-4 border-dashed border-zinc-300 text-[32px] text-zinc-400">
          Upload a template image to start
        </div>
      )}

      {/* photo layer — opaque, so it covers whatever face is baked into the template */}
      <div
        onPointerDown={(e) => startDrag(e, "photo")}
        onPointerMove={moveDrag}
        onPointerUp={() => (drag.current = null)}
        style={{
          left: px(layers.photo.x),
          top: px(layers.photo.y),
          width: px(layers.photo.size),
          height: px(layers.photo.size),
          borderRadius: layers.photo.round ? "50%" : 0,
          backgroundColor: photo ? undefined : "#ffffff",
        }}
        className="absolute flex cursor-move touch-none items-center justify-center overflow-hidden"
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={name ? `Photo of ${name}` : "Uploaded portrait"}
            draggable={false}
            className="h-full w-full object-cover"
            style={{ transform: `translate(${transform.offsetX}px, ${transform.offsetY}px) scale(${transform.scale})` }}
          />
        ) : (
          <span className="px-6 text-center text-[24px] text-zinc-400">Photo</span>
        )}
        {selected === "photo" && <Outline />}
      </div>

      {textLayer("name", name, "तपाईंको नाम")}
      {textLayer("position", position, "तपाईंको पद")}
    </div>
  );
});

/** Editor-only selection ring. data-ui marks it so the exporter strips it from the PNG. */
function Outline() {
  return (
    <div
      data-ui="1"
      className="pointer-events-none absolute -inset-[4px] rounded-[8px] border-[4px] border-dashed border-sky-500"
    />
  );
}

export default PosterCanvas;
