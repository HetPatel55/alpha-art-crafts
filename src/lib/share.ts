"use client";

import { photoPath, type Photo } from "@/data/gallery";
import { site } from "@/data/site";
import { mediaUrl } from "./image-loader";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function photoLink(photo: Photo) {
  return `${window.location.origin}${basePath}${photoPath(photo)}`;
}

/** Render the photo to a JPEG file — WhatsApp treats shared WebP files as stickers. */
async function photoFile(photo: Photo): Promise<File | null> {
  try {
    const img = new Image();
    img.src = mediaUrl(photo.src, 960);
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext("2d")?.drawImage(img, 0, 0);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
    return blob ? new File([blob], `${photo.code}.jpg`, { type: "image/jpeg" }) : null;
  } catch {
    return null;
  }
}

/**
 * Share a photo: on phones this opens the native share sheet with the picture itself
 * attached (so family sees it straight away in WhatsApp); otherwise it falls back
 * to a WhatsApp message with the link.
 */
export async function sharePhoto(photo: Photo) {
  const url = photoLink(photo);
  const text = `${photo.title} (${photo.code}) — ${site.name}`;

  if (typeof navigator.share === "function") {
    const file = await photoFile(photo);
    try {
      if (file && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: site.name, text: `${text}\n${url}` });
      } else {
        await navigator.share({ title: site.name, text, url });
      }
      return;
    } catch (error) {
      if ((error as DOMException)?.name === "AbortError") return; // user closed the sheet
    }
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, "_blank", "noopener");
}
