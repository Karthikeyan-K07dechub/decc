/** Sheet code + split heading + optional intro: the opening of every section. */
export function SectionHead({
  code,
  title,
  intro,
  as: Tag = "h2",
  className = "",
  size = "h2",
}: {
  code?: string;
  title: string;
  intro?: string;
  as?: "h1" | "h2";
  className?: string;
  size?: "h2" | "h-display" | "h2-compact";
}) {
  return (
    <header className={`grid gap-6 ${className}`}>
      {code && (
        <p className="sheet-code mono ltr" data-fade>
          {code}
        </p>
      )}
      <Tag className={`display ${size} max-w-[18ch]`} data-split>
        {title}
      </Tag>
      {intro && (
        <p className="lead text-concrete-soft [.on-ink_&]:text-ink-muted" data-fade data-delay="0.15">
          {intro}
        </p>
      )}
    </header>
  );
}

/** A dimension line: ticks at both ends with a label in the middle, like a drawing annotation. */
export function Dimension({ label, className = "" }: { label?: string; className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden={label ? undefined : true}>
      <span className="h-3 w-px bg-current opacity-60" />
      <span className="h-px flex-1 origin-[left_center] bg-current opacity-40 rtl:origin-[right_center]" data-rule />
      {label && <span className="mono ltr shrink-0 opacity-80">{label}</span>}
      {label && <span className="h-px flex-1 origin-[right_center] bg-current opacity-40 rtl:origin-[left_center]" data-rule />}
      <span className="h-3 w-px bg-current opacity-60" />
    </div>
  );
}
