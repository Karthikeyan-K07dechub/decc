import type { Project } from "@/lib/content";

/**
 * Front elevations drawn in the house line style (teal, 1px, non-scaling), used before a photo is
 * revealed and as the "drawing" side of the before/after slider. viewBox 0 0 400 260, ground at y=220.
 */
const ELEVATIONS: Record<Project["elevation"], string[]> = {
  villa: [
    "M20 220h360",
    "M40 220V120h130v100",
    "M170 220V80h190v140",
    "M36 120h138M166 80h198",
    "M40 112h130M170 72h190",
    "M60 220v-60h36v60",
    "M200 220v-70h50v70",
    "M280 160h60v-40h-60zM280 140h60M310 120v40",
    "M196 128h12M216 128h12M236 128h12M256 128h12",
    "M120 150h30v40h-30z",
    "M20 232h12M368 232h12M26 226v12M374 226v12",
    "M20 232h360",
  ],
  tower: [
    "M20 220h360",
    "M120 220V40h160v180",
    "M120 70h160M120 100h160M120 130h160M120 160h160M120 190h160",
    "M150 40v180M200 40v180M250 40v180",
    "M110 40h180M116 32h168",
    "M180 220v-26h40v26",
    "M60 220v-60h60M280 160h60v60",
    "M20 232h360M20 226v12M380 226v12",
  ],
  mosque: [
    "M20 220h360",
    "M90 220V130h220v90",
    "M130 130a70 70 0 0 1 140 0",
    "M200 60v-14M196 52h8",
    "M330 220V50h22v170",
    "M326 50l15-22 15 22",
    "M326 90h30M326 140h30",
    "M180 220v-50a20 20 0 0 1 40 0v50",
    "M110 190v-30a10 10 0 0 1 20 0v30M270 190v-30a10 10 0 0 1 20 0v30",
    "M84 130h232",
    "M20 232h360M20 226v12M380 226v12",
  ],
  warehouse: [
    "M20 220h360",
    "M40 220V110l160-40 160 40v110",
    "M40 110h320",
    "M80 220v-70h70v70M170 220v-70h70v70M260 220v-70h70v70",
    "M80 185h70M170 185h70M260 185h70",
    "M100 110v-6M300 110v-6",
    "M40 130h320",
    "M20 232h360M20 226v12M380 226v12",
  ],
  block: [
    "M20 220h360",
    "M80 220V50h240v170",
    "M80 84h240M80 118h240M80 152h240M80 186h240",
    "M110 60h40v18h-40zM180 60h40v18h-40zM250 60h40v18h-40z",
    "M110 94h40v18h-40zM180 94h40v18h-40zM250 94h40v18h-40z",
    "M110 128h40v18h-40zM180 128h40v18h-40zM250 128h40v18h-40z",
    "M110 162h40v18h-40zM180 162h40v18h-40zM250 162h40v18h-40z",
    "M180 220v-28h40v28",
    "M72 50h256",
    "M20 232h360M20 226v12M380 226v12",
  ],
};

export function Elevation({
  kind,
  className = "",
  draw = false,
  tone = "teal",
}: {
  kind: Project["elevation"];
  className?: string;
  draw?: boolean;
  tone?: "teal" | "soft";
}) {
  return (
    <svg
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMid meet"
      className={`${tone === "soft" ? "text-teal-soft" : "text-teal"} ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden
      data-draw={draw ? "" : undefined}
      data-stagger="0.06"
    >
      {ELEVATIONS[kind].map((d) => (
        <path key={d} d={d} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}
