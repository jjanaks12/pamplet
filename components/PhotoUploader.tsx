"use client";

import { useRef, useState } from "react";
import { DEFAULT_TRANSFORM, type PhotoTransform } from "@/lib/poster";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

type PhotoUploaderProps = {
  photo: string | null;
  transform: PhotoTransform;
  onPhotoChange: (photo: string | null) => void;
  onTransformChange: (transform: PhotoTransform) => void;
};

export default function PhotoUploader({
  photo,
  transform,
  onPhotoChange,
  onTransformChange,
}: PhotoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const dragState = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(
    null
  );

  function loadFile(file: File | undefined) {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("That file isn't a supported image. Try a PNG, JPEG, or WEBP.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError("That file is over 10 MB. Try a smaller photo.");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      onPhotoChange(reader.result as string);
      onTransformChange(DEFAULT_TRANSFORM);
    };
    reader.readAsDataURL(file);
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!photo) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: transform.offsetX,
      originY: transform.offsetY,
    };
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragState.current) return;
    const { startX, startY, originX, originY } = dragState.current;
    onTransformChange({
      ...transform,
      offsetX: originX + (e.clientX - startX),
      offsetY: originY + (e.clientY - startY),
    });
  }

  function handlePointerUp() {
    dragState.current = null;
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-zinc-700">Photo</span>

      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          loadFile(e.dataTransfer.files[0]);
        }}
        onClick={() => {
          if (!photo) fileInputRef.current?.click();
        }}
        onKeyDown={(e) => {
          if (!photo && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        role={photo ? undefined : "button"}
        tabIndex={photo ? undefined : 0}
        aria-label={photo ? undefined : "Upload a photo"}
        className={`relative h-[220px] w-[220px] touch-none overflow-hidden rounded-2xl border-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2 ${
          photo ? "cursor-grab border-solid border-emerald-800 active:cursor-grabbing" : "cursor-pointer border-dashed border-zinc-300 bg-zinc-50"
        }`}
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt="Uploaded portrait preview"
            draggable={false}
            className="h-full w-full select-none object-cover"
            style={{
              transform: `translate(${transform.offsetX}px, ${transform.offsetY}px) scale(${transform.scale})`,
            }}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 px-6 text-center text-sm text-zinc-500">
            <span>Drop a photo here or click to upload</span>
            <span className="text-xs text-zinc-400">PNG, JPEG, or WEBP, up to 10 MB</span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => loadFile(e.target.files?.[0])}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      {photo && (
        <>
          <label className="flex flex-col gap-1 text-sm text-zinc-700">
            Zoom
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={transform.scale}
              onChange={(e) => onTransformChange({ ...transform, scale: Number(e.target.value) })}
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800"
            />
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2"
            >
              Change photo
            </button>
            <button
              type="button"
              onClick={() => onTransformChange(DEFAULT_TRANSFORM)}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2"
            >
              Reset
            </button>
          </div>
        </>
      )}
    </div>
  );
}
