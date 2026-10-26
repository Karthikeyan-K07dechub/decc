"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { ImageId } from "@/lib/images";
import type { Project } from "@/lib/content";
import { Photo } from "./Photo";
import { Elevation } from "./Elevation";

/**
 * Drag (or use the arrow keys) to compare the line drawing with the photo.
 * Built on a native range input so it works with keyboard and screen readers.
 */
export function BeforeAfter({ image, elevation }: { image: ImageId; elevation: Project["elevation"] }) {
  const t = useTranslations("projects");
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);

  return (
    <figure>
      <div ref={box} className="relative aspect-[16/10] w-full select-none overflow-hidden bg-ink" dir="ltr">
        <Photo id={image} sizes="(min-width: 1024px) 80vw, 100vw" />
        <div className="drafting absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <div className="absolute inset-[8%]">
            <Elevation kind={elevation} className="h-full w-full" />
          </div>
        </div>
        <span className="mono absolute start-4 top-4 bg-paper px-2 py-1">{t("drawing")}</span>
        <span className="mono absolute end-4 top-4 bg-ink px-2 py-1 text-paper">{t("photo")}</span>
        {/* Handle */}
        <span className="pointer-events-none absolute inset-y-0 w-px bg-clay" style={{ left: `${pos}%` }} aria-hidden>
          <span className="absolute start-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-clay bg-paper text-clay">
            ↔
          </span>
        </span>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={t("compareLabel")}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="mono mt-3 text-concrete-soft">{t("compareLabel")}</figcaption>
    </figure>
  );
}
