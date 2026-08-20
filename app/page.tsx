"use client";

import { useLayoutEffect, useRef, useState } from "react";
import PosterCanvas from "@/components/PosterCanvas";
import EditorPanel from "@/components/EditorPanel";
import DownloadButton from "@/components/DownloadButton";
import {
  DEFAULT_LAYERS,
  DEFAULT_TEMPLATE,
  DEFAULT_TRANSFORM,
  type LayerId,
  type Layers,
  type PhotoTransform,
  type Template,
} from "@/lib/poster";

export default function Home() {
  const template: Template = DEFAULT_TEMPLATE;
  const [photo, setPhoto] = useState<string | null>(null);
  const [transform, setTransform] = useState<PhotoTransform>(DEFAULT_TRANSFORM);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [layers, setLayers] = useState<Layers>(DEFAULT_LAYERS);
  const [selected, setSelected] = useState<LayerId | null>(null);

  const posterRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const width = template?.width ?? 1080;
  const height = template?.height ?? 1080;

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / width));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div className="flex min-h-full flex-1 flex-col gap-8 bg-zinc-50 p-6 md:flex-row md:items-start md:justify-center">
      <div className="order-2 w-full max-w-sm md:order-1">
        <EditorPanel
          photo={photo}
          transform={transform}
          name={name}
          position={position}
          layers={layers}
          selected={selected}
          onPhotoChange={setPhoto}
          onTransformChange={setTransform}
          onNameChange={setName}
          onPositionChange={setPosition}
          onLayersChange={setLayers}
        />
        <div className="mt-6">
          <DownloadButton posterRef={posterRef} template={template} name={name} disabled={!template || !photo} />
        </div>
      </div>

      <div ref={containerRef} className="order-1 w-full max-w-[540px] md:sticky md:top-6 md:order-2">
        <div style={{ height: height * scale }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
            <PosterCanvas
              ref={posterRef}
              template={template}
              photo={photo}
              transform={transform}
              name={name}
              position={position}
              layers={layers}
              selected={selected}
              onSelect={setSelected}
              onLayersChange={setLayers}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
