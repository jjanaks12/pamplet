import { slugify, type Template } from "@/lib/poster";

/**
 * Renders the poster node to a PNG and triggers a download.
 * All of the below are known html-to-image workarounds — see CLAUDE.md's export section.
 */
export async function downloadPosterPng(node: HTMLElement, template: Template, name: string) {
  const { toPng } = await import("html-to-image");

  const options = {
    width: template.width,
    height: template.height,
    pixelRatio: 2,
    backgroundColor: "#ffffff",
    // Neutralize the preview's scale-down transform — capture always happens at full size.
    style: { transform: "scale(1)", transformOrigin: "top left" },
    // Drop editor-only chrome (selection rings) from the exported image.
    filter: (n: HTMLElement) => !n.dataset?.ui,
  };

  // The first render can miss embedded images/fonts in Safari/Firefox — discard it and re-render.
  await toPng(node, options);
  const dataUrl = await toPng(node, options);

  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `nc-poster-${slugify(name)}.png`;
  link.click();
}
