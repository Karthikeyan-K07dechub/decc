/**
 * A schematic line map of central Ras Al Khaimah (not to scale): the Gulf coast, Khor Ras Al Khaimah
 * creek, the main roads and the Hajar foothills, with a pulsing pin on Julphar Tower, Al Hisn Street.
 */
export function RakMap({ label, caption }: { label: string; caption: string }) {
  return (
    <figure className="relative">
      <svg viewBox="0 0 480 520" className="w-full bg-gypsum text-teal" fill="none" stroke="currentColor" role="img" aria-label={label} data-draw data-stagger="0.05" data-duration="1.8" direction="ltr">
        {/* grid */}
        <g stroke="var(--color-concrete)" strokeOpacity="0.18" strokeWidth="1">
          {Array.from({ length: 9 }, (_, i) => (
            <path key={`v${i}`} d={`M${i * 60} 0V520`} vectorEffect="non-scaling-stroke" />
          ))}
          {Array.from({ length: 10 }, (_, i) => (
            <path key={`h${i}`} d={`M0 ${i * 60}H480`} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
        {/* Gulf coastline */}
        <path d="M0 40 C 60 70, 90 110, 120 160 S 150 250, 170 300 S 200 390, 220 440 S 250 500, 270 520" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        <path d="M0 52 C 58 82, 84 120, 110 168 S 140 256, 158 304" strokeOpacity="0.4" vectorEffect="non-scaling-stroke" />
        {/* Creek (Khor) */}
        <path d="M150 250 C 200 240, 230 260, 260 250 S 320 220, 350 240 S 380 280, 360 310 S 300 320, 270 300 S 210 280, 165 300" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
        {/* Roads */}
        <g stroke="var(--color-ink)" strokeOpacity="0.55">
          <path d="M175 0 L 210 180 L 230 300 L 260 520" vectorEffect="non-scaling-stroke" />
          <path d="M210 180 L 480 150" vectorEffect="non-scaling-stroke" />
          <path d="M230 300 L 480 330" vectorEffect="non-scaling-stroke" />
          <path d="M150 120 L 300 120 L 330 60" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
          <path d="M120 215 L 240 205" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </g>
        {/* Hajar foothills */}
        <path d="M380 0 L 400 40 L 430 20 L 450 70 L 480 50" strokeOpacity="0.6" vectorEffect="non-scaling-stroke" />
        <path d="M400 420 L 420 380 L 445 410 L 465 360 L 480 380" strokeOpacity="0.6" vectorEffect="non-scaling-stroke" />
        {/* Labels */}
        <g fill="currentColor" stroke="none" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1">
          <text x="24" y="250">ARABIAN GULF</text>
          <text x="282" y="282" fillOpacity="0.8">KHOR RAK</text>
          <text x="410" y="110">HAJAR</text>
          <text x="128" y="200" fill="var(--color-ink)">AL HISN ST</text>
        </g>
        {/* Pin: Julphar Tower */}
        <g transform="translate(200 210)">
          <circle r="22" className="origin-center animate-[pinPulse_2.4s_var(--ease-draw)_infinite] motion-reduce:animate-none" stroke="var(--color-clay)" vectorEffect="non-scaling-stroke" />
          <circle r="6" fill="var(--color-clay)" stroke="none" />
          <path d="M0 -6 V -40 H 60" stroke="var(--color-clay)" vectorEffect="non-scaling-stroke" />
          <text x="64" y="-36" fill="var(--color-ink)" stroke="none" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="1">
            JULPHAR TOWER · 10F
          </text>
        </g>
        <path d="M440 470 v-30 M434 446 l6 -8 6 8" stroke="var(--color-ink)" vectorEffect="non-scaling-stroke" />
        <text x="436" y="488" fill="var(--color-ink)" stroke="none" fontFamily="var(--font-mono)" fontSize="10">N</text>
      </svg>
      <figcaption className="mono mt-3 flex justify-between text-concrete-soft">
        <span>{caption}</span>
        <span>NTS</span>
      </figcaption>
    </figure>
  );
}
