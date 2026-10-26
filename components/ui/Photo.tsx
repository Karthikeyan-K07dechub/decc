"use client";

import Image, { type ImageLoader } from "next/image";
import { useLocale } from "next-intl";
import { images, blurFor, type ImageId } from "@/lib/images";

/**
 * Unsplash and Pexels resize on their own CDN, so photos are requested at the exact width
 * next/image asks for (no double optimisation). Local files in /public use the default loader.
 */
const cdnLoader: ImageLoader = ({ src, width, quality }) => {
  const q = quality ?? 70;
  if (src.includes("images.unsplash.com")) return `${src}?w=${width}&q=${q}&auto=format&fit=crop`;
  if (src.includes("images.pexels.com")) return `${src}?auto=compress&cs=tinysrgb&w=${width}`;
  return src;
};

interface Props {
  id: ImageId;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  /** Pass false to keep the original colour (e.g. inside a lightbox). */
  graded?: boolean;
  alt?: string;
}

/** A photo from lib/images.ts, filling its (relatively positioned) parent, with blur-up and the house grade. */
export function Photo({ id, sizes, className = "", imgClassName = "", priority, graded = true, alt }: Props) {
  const locale = useLocale();
  const im = images[id];
  const external = /^https?:/.test(im.url);
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <Image
        src={im.url}
        alt={alt ?? (locale === "ar" ? im.alt.ar : im.alt.en)}
        fill
        sizes={sizes}
        priority={priority}
        loader={external ? cdnLoader : undefined}
        placeholder="blur"
        blurDataURL={blurFor(id)}
        className={`object-cover ${graded ? "graded" : ""} ${imgClassName}`}
      />
      {graded && <span className="grade-overlay" aria-hidden />}
    </div>
  );
}
