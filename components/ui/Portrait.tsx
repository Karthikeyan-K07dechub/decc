/**
 * Drawn portrait placeholder (no stock faces): a line-drawn head and shoulders on a tinted card.
 * Grey by default, warming to colour on hover. Replace with real team photos when DECC supplies them.
 */
const TINTS = ["#d9c7ae", "#c9d6d3", "#e0cdbd", "#cfd3c4", "#d8c3b5", "#c7d1d6"];

export function Portrait({ seed, label }: { seed: number; label: string }) {
  const tint = TINTS[seed % TINTS.length];
  return (
    <div
      className="group relative aspect-[3/4] overflow-hidden grayscale transition-[filter] duration-700 hover:grayscale-0"
      style={{ background: tint }}
      role="img"
      aria-label={label}
    >
      <svg viewBox="0 0 120 160" className="absolute inset-0 h-full w-full text-ink/60" fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="60" cy="62" r="22" vectorEffect="non-scaling-stroke" />
        <path d="M18 160c4-34 20-50 42-50s38 16 42 50" vectorEffect="non-scaling-stroke" />
        <path d="M0 140h120" strokeDasharray="2 4" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="mono absolute bottom-2 start-2 text-[0.65rem] text-ink/70">{label}</span>
    </div>
  );
}
