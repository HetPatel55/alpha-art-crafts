import Image from "next/image";
import type { Photo as PhotoData } from "@/data/gallery";

type Props = {
  photo: PhotoData;
  sizes: string;
  className?: string;
  /** Fill the parent box (parent must be positioned) instead of using intrinsic size. */
  fill?: boolean;
  preload?: boolean;
};

export default function Photo({ photo, sizes, className, fill, preload }: Props) {
  return (
    <Image
      src={photo.src}
      alt={photo.title}
      sizes={sizes}
      placeholder={photo.blur as `data:image/${string}`}
      preload={preload}
      className={className}
      {...(fill ? { fill: true } : { width: photo.width, height: photo.height })}
    />
  );
}
