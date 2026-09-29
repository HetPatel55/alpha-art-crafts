import type { ReactNode } from "react";
import Reveal from "./Reveal";
import { site, whatsappLink } from "@/data/site";
import { PhoneIcon, WhatsAppIcon } from "./Icons";

/** Title block used at the top of every inner page (sits below the fixed header). */
export function PageHero({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="grain bg-cream pt-24 pb-8 md:pt-44 md:pb-20">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-3 max-w-4xl font-display text-[2.5rem] leading-[1.02] font-medium text-balance md:mt-4 md:text-7xl">
            {title}
          </h1>
          {children && (
            <div className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-umber md:mt-6 md:text-lg">{children}</div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  children,
  align = "left",
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 font-display text-[2.1rem] leading-[1.05] font-medium text-balance md:mt-4 md:text-6xl">{title}</h2>
      {children && <div className="mt-3 text-[0.95rem] leading-relaxed text-umber md:mt-5 md:text-lg">{children}</div>}
    </Reveal>
  );
}

export const processSteps = [
  {
    title: "Share your idea",
    text: "Send us your wall or door size, a reference photo or just a mood — WhatsApp is perfect.",
  },
  {
    title: "Design & quote",
    text: "We adapt the motif to your exact dimensions, suggest a finish and share a clear quote.",
  },
  {
    title: "Carve & hand-finish",
    text: "Precision CNC relief carving, then detailed and painted by hand in your chosen colour.",
  },
  {
    title: "Deliver & install",
    text: "Carefully packed and shipped across India, with installation guidance included.",
  },
];

export function ProcessSteps({ dark = false }: { dark?: boolean }) {
  return (
    <ol className="rail md:mx-0 md:grid md:grid-cols-2 md:gap-px md:overflow-hidden md:rounded-2xl md:px-0 lg:grid-cols-4">
      {processSteps.map((step, i) => (
        <Reveal
          as="li"
          key={step.title}
          delay={i * 100}
          className={`w-[74vw] max-w-xs rounded-2xl p-6 md:w-auto md:max-w-none md:rounded-none md:p-9 ${dark ? "bg-white/[0.05]" : "bg-ivory"}`}
        >
          <span className={`font-display text-4xl italic md:text-5xl ${dark ? "text-clay" : "text-clay/80"}`}>
            0{i + 1}
          </span>
          <h3 className="mt-4 font-display text-2xl font-medium md:mt-6">{step.title}</h3>
          <p className={`mt-3 text-sm leading-relaxed ${dark ? "text-sand/75" : "text-umber"}`}>{step.text}</p>
        </Reveal>
      ))}
    </ol>
  );
}

export function EnquiryBanner({
  title = "Let's carve something for your space",
  text = "Architects, interior designers and homeowners — share a photo of your wall, its size or a reference, and we'll design the piece and send you a quote.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="container-x py-10 md:py-28">
      <Reveal className="grain relative overflow-hidden rounded-3xl bg-clay px-5 py-10 text-center text-white md:px-16 md:py-24">
        <svg
          className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 opacity-15"
          viewBox="0 0 200 200"
          aria-hidden
        >
          {[90, 70, 50, 30].map((r) => (
            <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="currentColor" strokeWidth="1" />
          ))}
        </svg>
        <h2 className="mx-auto max-w-3xl font-display text-[2.1rem] leading-[1.05] font-medium text-balance md:text-6xl">
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[0.95rem] leading-relaxed text-white/85 md:mt-5 md:text-base">{text}</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={whatsappLink()} target="_blank" rel="noopener" className="btn bg-white text-walnut hover:bg-ivory">
            <WhatsAppIcon size={18} /> Chat on WhatsApp
          </a>
          <a href={site.phoneHref} className="btn btn-outline-light">
            <PhoneIcon size={18} /> {site.phone}
          </a>
        </div>
      </Reveal>
    </section>
  );
}

/** Small "swipe" cue shown above horizontal rails on phones only. */
export function SwipeHint({ light = false }: { light?: boolean }) {
  return (
    <p
      className={`mt-4 flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.18em] uppercase md:hidden ${
        light ? "text-sand/60" : "text-stone"
      }`}
      aria-hidden
    >
      Swipe
      <svg width="28" height="10" viewBox="0 0 28 10" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M0 5h26M22 1l4 4-4 4" />
      </svg>
    </p>
  );
}
