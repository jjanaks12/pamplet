"use client";

import PhotoUploader from "@/components/PhotoUploader";
import { NAME_MAX_LENGTH, POSITION_MAX_LENGTH, type PhotoTransform } from "@/lib/poster";

type EditorPanelProps = {
  photo: string | null;
  transform: PhotoTransform;
  name: string;
  position: string;
  onPhotoChange: (photo: string | null) => void;
  onTransformChange: (transform: PhotoTransform) => void;
  onNameChange: (name: string) => void;
  onPositionChange: (position: string) => void;
};

export default function EditorPanel({
  photo,
  transform,
  name,
  position,
  onPhotoChange,
  onTransformChange,
  onNameChange,
  onPositionChange,
}: EditorPanelProps) {
  return (
    <div className="flex flex-col gap-6">
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
          className="rounded-md border border-zinc-300 px-3 py-2 text-base text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
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
          className="rounded-md border border-zinc-300 px-3 py-2 text-base text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
        />
      </label>
    </div>
  );
}
