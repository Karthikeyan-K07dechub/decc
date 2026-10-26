/** "DECC" wordmark with the Arabic name set small beside it. */
export function Logo({ nameAr, className }: { nameAr: string; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ""}`}>
      <span className="display ltr text-[1.6rem] leading-none tracking-[-0.03em]" style={{ fontVariationSettings: '"wdth" 125', fontWeight: 800 }}>
        DECC
      </span>
      <span className="hidden border-s border-current/25 ps-3 text-[0.72rem] leading-tight opacity-80 sm:block" lang="ar" dir="rtl" style={{ fontFamily: "var(--font-plex-arabic), sans-serif" }}>
        {nameAr}
      </span>
    </span>
  );
}
