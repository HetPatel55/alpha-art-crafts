// next/image loader for the pre-generated WebP files made by scripts/build-images.mjs.
// `src` is the extension-less path from the manifest, e.g. "/media/furniture/furniture-01".

// Keep in sync with WIDTHS in scripts/build-images.mjs
export const WIDTHS = [384, 640, 960, 1280, 1920] as const;

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function mediaUrl(src: string, width: number) {
  const w = WIDTHS.find((size) => size >= width) ?? WIDTHS[WIDTHS.length - 1];
  return `${basePath}${src}-${w}.webp`;
}

export default function imageLoader({ src, width }: { src: string; width: number }) {
  if (!src.startsWith("/media/")) return `${basePath}${src}`;
  return mediaUrl(src, width);
}
