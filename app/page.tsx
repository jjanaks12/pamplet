"use client";

import { useLayoutEffect, useRef, useState } from "react";
import PosterCanvas from "@/components/PosterCanvas";
import EditorPanel from "@/components/EditorPanel";
import DownloadButton from "@/components/DownloadButton";
import { DEFAULT_TRANSFORM, POSTER_WIDTH, POSTER_HEIGHT, type PhotoTransform } from "@/lib/poster";

export default function Home() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [transform, setTransform] = useState<PhotoTransform>(DEFAULT_TRANSFORM);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");

  const posterRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / POSTER_WIDTH));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex min-h-full flex-1 flex-col gap-8 bg-zinc-50 p-6 md:flex-row md:items-start md:justify-center">
      <div className="order-2 w-full max-w-sm md:order-1">
        <EditorPanel
          photo={photo}
          transform={transform}
          name={name}
          position={position}
          onPhotoChange={setPhoto}
          onTransformChange={setTransform}
          onNameChange={setName}
          onPositionChange={setPosition}
        />
        <div className="mt-6">
          <DownloadButton posterRef={posterRef} name={name} disabled={!photo} />
        </div>
      </div>

      <div ref={containerRef} className="order-1 w-full max-w-[540px] md:sticky md:top-6 md:order-2">
        <div style={{ height: POSTER_HEIGHT * scale }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
            <PosterCanvas
              ref={posterRef}
              photo={photo}
              transform={transform}
              name={name}
              position={position}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
