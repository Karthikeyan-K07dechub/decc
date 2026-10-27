import type { ImageId } from "@/lib/images";
import { Photo } from "./Photo";

/** Stock portraits for clearly labelled illustrative team profiles. */
export function Portrait({ image }: { image: ImageId }) {
  return (
    <div
      className="group relative aspect-[3/4] overflow-hidden grayscale transition-[filter] duration-700 hover:grayscale-0"
    >
      <Photo id={image} sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 50vw" imgClassName="object-[center_30%]" />
    </div>
  );
}
