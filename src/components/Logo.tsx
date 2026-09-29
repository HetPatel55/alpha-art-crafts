import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-3 ${className}`} aria-label="Alpha Art & Crafts — home">
      <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden>
        <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" strokeWidth="1" opacity=".5" />
        <path
          d="M11 29 20 10l9 19M14.2 22.5h11.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M20 16.5c1.8 1.6 1.8 3.4 0 5-1.8-1.6-1.8-3.4 0-5Z" fill="var(--color-clay)" />
      </svg>
      <span className="leading-none">
        <span className="block font-display text-[1.45rem] font-semibold tracking-wide">Alpha</span>
        <span className="mt-0.5 block text-[0.6rem] font-semibold tracking-[0.32em] uppercase opacity-75">
          Art &amp; Crafts
        </span>
      </span>
    </Link>
  );
}
