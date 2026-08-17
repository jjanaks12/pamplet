export const POSTER_WIDTH = 1080;
export const POSTER_HEIGHT = 1350;

export const NAME_MAX_LENGTH = 40;
export const POSITION_MAX_LENGTH = 60;

export type PhotoTransform = {
  scale: number;
  offsetX: number;
  offsetY: number;
};

export const DEFAULT_TRANSFORM: PhotoTransform = { scale: 1, offsetX: 0, offsetY: 0 };

/** Steps down through preset sizes as text length crosses each threshold. */
export function stepFontSize(value: string, thresholds: number[], sizes: string[]): string {
  let index = 0;
  for (const threshold of thresholds) {
    if (value.length > threshold) index += 1;
  }
  return sizes[Math.min(index, sizes.length - 1)];
}

export function slugify(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "poster";
}
