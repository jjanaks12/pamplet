"use client";

import PhotoUploader from "@/components/PhotoUploader";
import {
  DEFAULT_LAYERS,
  NAME_MAX_LENGTH,
  POSITION_MAX_LENGTH,
  type LayerId,
  type Layers,
  type PhotoTransform,
} from "@/lib/poster";

type EditorPanelProps = {
  photo: string | null;
  transform: PhotoTransform;
  name: string;
  position: string;
  layers: Layers;
  selected: LayerId | null;
  onPhotoChange: (photo: string | null) => void;
  onTransformChange: (transform: PhotoTransform) => void;
  onNameChange: (name: string) => void;
  onPositionChange: (position: string) => void;
  onLayersChange: (layers: Layers) => void;
};

const inputClass =
  "rounded-md border border-zinc-300 px-3 py-2 text-base text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-800";
const buttonClass =
  "rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2";

export default function EditorPanel({
  photo,
  transform,
  name,
  position,
  layers,
  selected,
  onPhotoChange,
  onTransformChange,
  onNameChange,
  onPositionChange,
  onLayersChange,
}: EditorPanelProps) {
  const layer = selected ? layers[selected] : null;
  const textId = selected === "name" || selected === "position" ? selected : null;

  return (
    <div className="flex flex-col gap-6">
      {/* Template is fixed to public/maintemplate.jpeg for now — upload disabled.
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-zinc-700">Template</span>
        <input
          ref={templateInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => loadTemplate(e.target.files?.[0])}
          aria-label="Upload a template image"
          className="text-sm text-zinc-700 file:mr-3 file:rounded-md file:border file:border-zinc-300 file:bg-white file:px-3 file:py-1.5 file:text-sm file:text-zinc-700"
        />
        {template && (
          <p className="text-xs text-zinc-500">
            {template.width} × {template.height} px. Drag the photo and text on the preview to place them.
          </p>
        )}
        {templateError && <p className="text-sm text-red-600">{templateError}</p>}
      </div>
      */}

      <PhotoUploader
        photo={photo}
        transform={transform}
        onPhotoChange={onPhotoChange}
        onTransformChange={onTransformChange}
      />

      <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
        Name
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          maxLength={NAME_MAX_LENGTH}
          placeholder="Your name"
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
        Position
        <input
          type="text"
          value={position}
          onChange={(e) => onPositionChange(e.target.value)}
          maxLength={POSITION_MAX_LENGTH}
          placeholder="Your position"
          className={inputClass}
        />
      </label>

      <div className="flex flex-col gap-3 rounded-md border border-zinc-200 p-3">
        <span className="text-sm font-medium text-zinc-700">
          {selected ? `Selected: ${selected}` : "Selected layer"}
        </span>

        {!layer && <p className="text-sm text-zinc-500">Click the photo or a line of text on the poster to adjust it.</p>}

        {layer && selected === "photo" && (
          <>
            <label className="flex flex-col gap-1 text-sm text-zinc-700">
              Frame size
              <input
                type="range"
                min={0.05}
                max={0.9}
                step={0.005}
                value={layers.photo.size}
                onChange={(e) => onLayersChange({ ...layers, photo: { ...layers.photo, size: Number(e.target.value) } })}
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={layers.photo.round}
                onChange={(e) => onLayersChange({ ...layers, photo: { ...layers.photo, round: e.target.checked } })}
              />
              Round frame
            </label>
          </>
        )}

        {textId && (
          <>
            <label className="flex flex-col gap-1 text-sm text-zinc-700">
              Text size
              <input
                type="range"
                min={0.01}
                max={0.12}
                step={0.002}
                value={layers[textId].size}
                onChange={(e) =>
                  onLayersChange({ ...layers, [textId]: { ...layers[textId], size: Number(e.target.value) } })
                }
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-zinc-700">
              Text width
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.01}
                value={layers[textId].width}
                onChange={(e) =>
                  onLayersChange({ ...layers, [textId]: { ...layers[textId], width: Number(e.target.value) } })
                }
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-700">
              Text colour
              <input
                type="color"
                value={layers[textId].color}
                onChange={(e) =>
                  onLayersChange({ ...layers, [textId]: { ...layers[textId], color: e.target.value } })
                }
                className="h-8 w-12 rounded border border-zinc-300"
              />
            </label>
          </>
        )}

        <button type="button" onClick={() => onLayersChange(DEFAULT_LAYERS)} className={`${buttonClass} self-start`}>
          Reset placement
        </button>
      </div>
    </div>
  );
}
