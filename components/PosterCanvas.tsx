"use client";

import { forwardRef } from "react";
import { POSTER_WIDTH, POSTER_HEIGHT, stepFontSize, type PhotoTransform } from "@/lib/poster";

type PosterCanvasProps = {
  photo: string | null;
  transform: PhotoTransform;
  name: string;
  position: string;
};

// Explicit hex colors only in this subtree — oklch/Tailwind color tokens break html-to-image export.
const colors = {
  bgFrom: "#1c6b34",
  bgTo: "#0b3d1f",
  titleText: "#ffffff",
  nameBg: "#d21f1f",
  nameText: "#ffffff",
  positionBg: "#ffffff",
  positionText: "#d21f1f",
  placeholder: "#e5e7eb",
  frameBorder: "#ffffff",
  frameEmptyBorder: "#ffffff80",
  frameEmptyBg: "#ffffff1a",
};

const PosterCanvas = forwardRef<HTMLDivElement, PosterCanvasProps>(function PosterCanvas(
  { photo, transform, name, position },
  ref
) {
  const nameSize = stepFontSize(name, [16, 28], ["text-5xl", "text-4xl", "text-3xl"]);
  const positionSize = stepFontSize(position, [24, 40], ["text-2xl", "text-xl", "text-lg"]);

  return (
    <div
      ref={ref}
      style={{
        width: POSTER_WIDTH,
        height: POSTER_HEIGHT,
        backgroundImage: `linear-gradient(135deg, ${colors.bgFrom} 0%, ${colors.bgTo} 100%)`,
      }}
      className="relative flex flex-col overflow-hidden"
    >
      {/* Logos — fixed, not editable */}
      <div className="flex items-center gap-6 px-16 pt-14">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/tree-removebg-preview.png" alt="Nepali Congress tree symbol" className="h-[110px] w-auto" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/flag-removebg-preview.png" alt="Nepali Congress flag" className="h-[90px] w-auto" />
      </div>

      {/* Photo frame — top-right */}
      <div
        style={{
          borderColor: photo ? colors.frameBorder : colors.frameEmptyBorder,
          backgroundColor: photo ? undefined : colors.frameEmptyBg,
          borderStyle: photo ? "solid" : "dashed",
        }}
        className="absolute right-16 top-14 flex h-[420px] w-[420px] items-center justify-center overflow-hidden rounded-2xl border-4"
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt="Uploaded portrait"
            className="h-full w-full object-cover"
            style={{
              transform: `translate(${transform.offsetX}px, ${transform.offsetY}px) scale(${transform.scale})`,
            }}
          />
        ) : (
          <span style={{ color: colors.placeholder }} className="px-6 text-center text-lg">
            Photo
          </span>
        )}
      </div>

      {/* Title — fixed text, not editable */}
      <div style={{ color: colors.titleText }} className="mt-16 max-w-[560px] px-16 text-5xl font-bold leading-tight">
        नेपाली कांग्रेस 
      </div>

      <div className="mt-auto px-16 pb-16">
        <div className="inline-flex w-fit flex-col overflow-hidden rounded-lg">
          <div style={{ backgroundColor: colors.nameBg, color: name ? colors.nameText : colors.placeholder }} className={`px-8 py-4 font-bold ${nameSize}`}>
            {name || "Your name"}
          </div>
          <div style={{ backgroundColor: colors.positionBg, color: position ? colors.positionText : colors.placeholder }} className={`px-8 py-2 font-semibold ${positionSize}`}>
            {position || "Your position"}
          </div>
        </div>
      </div>
    </div>
  );
});

export default PosterCanvas;
