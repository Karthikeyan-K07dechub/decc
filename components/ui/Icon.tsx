import type { IconName } from "@/lib/content";

/**
 * House-style line icons, drawn for DECC (no icon library): 1px teal strokes on a 48 grid.
 * Each path is a separate element so it can be redrawn with stroke-dashoffset.
 */
const PATHS: Record<IconName, string[]> = {
  // Compass: two legs, a hinge and an arc
  compass: ["M24 6v4", "M24 10a3 3 0 1 1 0 6 3 3 0 0 1 0-6", "M22.6 15.6 12 42", "M25.4 15.6 36 42", "M15 34.5a16 16 0 0 0 18 0", "M10 42h6M32 42h6"],
  // Column grid: three columns, beams, a dimension line
  columns: ["M8 14h32", "M8 22h32", "M12 14v26M24 14v26M36 14v26", "M6 40h36", "M8 8h32", "M8 6v4M40 6v4"],
  // Duct: a rectangular duct with a bend and a diffuser
  duct: ["M6 12h22v8H6", "M28 12a8 8 0 0 1 8 8v20", "M28 20v20", "M24 40h16", "M10 24v6h10v-6", "M12 30v3M15 30v3M18 30v3"],
  // Hard hat: dome, brim, ridge
  hardhat: ["M10 32a14 14 0 0 1 28 0", "M6 32h36v4H6z", "M24 18v14", "M18 20v12M30 20v12", "M20 18h8"],
  // Stamp: handle, body, impression and a tick
  stamp: ["M20 6h8v10h-8z", "M16 16h16v6H16z", "M10 22h28v6H10z", "M8 38h32", "M16 44h16", "M19 33l3 3 7-7"],
  // Chair: seat, back and legs, in elevation
  chair: ["M14 8h20v18H14z", "M10 26h28v6H10z", "M14 32v10M34 32v10", "M18 12v10M30 12v10", "M8 42h6M34 42h6"],
};

export function Icon({ name, className, draw = false, title }: { name: IconName; className?: string; draw?: boolean; title?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="square"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      data-draw={draw ? "" : undefined}
      data-icon
    >
      {PATHS[name].map((d) => (
        <path key={d} d={d} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}
