export const NAME_MAX_LENGTH = 40;
export const POSITION_MAX_LENGTH = 60;

export type PhotoTransform = {
  scale: number;
  offsetX: number;
  offsetY: number;
};

export const DEFAULT_TRANSFORM: PhotoTransform = { scale: 1, offsetX: 0, offsetY: 0 };

export type Template = { src: string; width: number; height: number };

/** The one fixed poster template. Template upload is disabled for now — see EditorPanel. */
export const DEFAULT_TEMPLATE: Template = { src: "/maintemplate.jpeg", width: 1080, height: 1080 };

/** All layer geometry is stored as a fraction of the template width, so any template size works. */
export type PhotoLayer = { x: number; y: number; size: number; round: boolean };
export type TextLayer = { x: number; y: number; width: number; size: number; color: string };
export type Layers = { photo: PhotoLayer; name: TextLayer; position: TextLayer };
export type LayerId = keyof Layers;

/** Tuned against the Nepali Congress sample template; drag on the poster to fit any other one. */
export const DEFAULT_LAYERS: Layers = {
  photo: { x: 0.02, y: 0.199, size: 0.4, round: true },
  name: { x: 0.0, y: 0.606, width: 0.44, size: 0.04, color: "#ffffff" },
  position: { x: 0.0, y: 0.648, width: 0.44, size: 0.028, color: "#ffffff" },
};

export function slugify(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "poster";
}

/** Reads an image file to a data URL plus its natural size. Blob URLs break html-to-image. */
export function readImage(file: File): Promise<Template> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => {
      const src = reader.result as string;
      const img = new Image();
      img.onerror = () => reject(new Error("decode failed"));
      img.onload = () => resolve({ src, width: img.naturalWidth, height: img.naturalHeight });
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}
