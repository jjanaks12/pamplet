"use client";

import { useState, type RefObject } from "react";
import { downloadPosterPng } from "@/lib/export";
import type { Template } from "@/lib/poster";

type DownloadButtonProps = {
  posterRef: RefObject<HTMLDivElement | null>;
  template: Template | null;
  name: string;
  disabled: boolean;
};

export default function DownloadButton({ posterRef, template, name, disabled }: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState(false);

  async function handleClick() {
    const node = posterRef.current;
    if (!node || !template) return;
    setDownloading(true);
    setError(null);
    setDownloaded(false);
    try {
      await downloadPosterPng(node, template, name);
      setDownloaded(true);
    } catch {
      setError("The poster couldn't be downloaded. Try again.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || downloading}
        className="rounded-md bg-emerald-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-zinc-300"
      >
        {downloading ? "Rendering…" : "Download poster"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {downloaded && !error && <p className="text-sm text-emerald-800">Poster downloaded</p>}
    </div>
  );
}
