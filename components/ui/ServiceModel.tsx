"use client";

import type { ModelKind } from "@/lib/content";
import type { ImageId } from "@/lib/images";
import { ServiceScene, useSceneMode } from "@/components/three/Scenes";
import { Photo } from "./Photo";

/** Service hero figure: a small rotating line model, or the service photo when motion is reduced. */
export function ServiceModel({ kind, image, label }: { kind: ModelKind; image: ImageId; label: string }) {
  const mode = useSceneMode();
  return (
    <div className="relative aspect-square w-full overflow-hidden border border-ink/10 bg-gypsum">
      {mode === "static" ? <Photo id={image} sizes="(min-width: 1024px) 38vw, 100vw" /> : mode === "3d" ? <ServiceScene kind={kind} label={label} /> : null}
      <span className="mono ltr pointer-events-none absolute bottom-3 start-3 text-concrete-soft">AXO · NTS</span>
      <span className="pointer-events-none absolute end-3 top-3 size-4 border-e border-t border-teal" aria-hidden />
      <span className="pointer-events-none absolute bottom-3 end-3 size-4 border-b border-e border-teal" aria-hidden />
    </div>
  );
}
