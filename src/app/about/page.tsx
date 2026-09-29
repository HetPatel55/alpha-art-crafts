import type { Metadata } from "next";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import { EnquiryBanner, PageHero, ProcessSteps, SectionHeading, SwipeHint } from "@/components/Sections";
import { getPhoto } from "@/data/gallery";

export const metadata: Metadata = {
  title: "About & Process",
  description:
    "How Alpha Art & Crafts designs, carves and hand-finishes bespoke relief art, doors and wooden furniture — from your brief to installation.",
};

const offerings = [
  ["Homes", "Feature walls, mandir units, entrance doors and statement furniture."],
  ["Temples & prayer rooms", "Murtis, arches, torans and carved mandir doors."],
  ["Architects & designers", "Custom motifs developed to your drawings and material palette."],
  ["Hospitality & commercial", "Lobby murals and signature walls for hotels, offices and restaurants."],
];

export default function AboutPage() {
  const workshop = getPhoto("workshop-02");
  const finished = getPhoto("religious-art-08");

  return (
    <>
      <PageHero eyebrow="About the studio" title={<>Craft you can <em className="text-clay">feel</em> with your hands</>}>
        <p>
          Alpha Art &amp; Crafts is a design and carving studio making relief art for walls, doors and sacred
          spaces. We combine CNC precision with traditional hand-finishing, so every piece has crisp detail and
          the warmth of something made by hand.
        </p>
      </PageHero>

      {/* Raw → finished */}
      <section className="container-x section-y">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="grid grid-cols-2 gap-2.5 md:gap-4">
            <Reveal>
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-cream">
                <Photo photo={workshop} fill sizes="(min-width:1024px) 22vw, 50vw" className="object-cover" />
              </div>
              <p className="mt-3 text-xs font-semibold tracking-wider text-umber uppercase">On the bench</p>
            </Reveal>
            <Reveal delay={120} className="mt-8 md:mt-12">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-cream">
                <Photo photo={finished} fill sizes="(min-width:1024px) 22vw, 50vw" className="object-cover" />
              </div>
              <p className="mt-3 text-xs font-semibold tracking-wider text-umber uppercase">In the home</p>
            </Reveal>
          </div>
          <div>
            <SectionHeading eyebrow="What we make" title="From a sketch to a centrepiece">
              <p>
                We work across religious art, floral and nature panels, doors and entryways, and solid-wood
                furniture. Whether it&apos;s a Shrinathji medallion for a home mandir or a full lobby wall for a
                hotel, each design is adapted to the exact size, colour and finish of its space.
              </p>
            </SectionHeading>
            <dl className="mt-7 grid grid-cols-2 gap-x-4 gap-y-5 md:mt-10 md:gap-6">
              {offerings.map(([title, text], i) => (
                <Reveal key={title} delay={i * 80} className="border-t border-walnut/15 pt-4">
                  <dt className="font-display text-lg leading-tight font-medium md:text-xl">{title}</dt>
                  <dd className="mt-1.5 text-[0.8rem] leading-relaxed text-umber md:text-sm">{text}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="grain section-y bg-cream">
        <div className="container-x">
          <div className="mb-6 md:mb-14">
            <SectionHeading eyebrow="Our process" title="Simple, transparent, made for you" />
            <SwipeHint />
          </div>
          <ProcessSteps />
        </div>
      </section>

      <section className="container-x section-y">
        <SectionHeading eyebrow="Finishes" title="Any colour, any mood" align="center">
          <p>
            Sage greens, blush pinks, terracotta, teal, classic white-and-gold or a natural wood tone — we match the
            finish to your interior palette.
          </p>
        </SectionHeading>
        <Reveal className="mt-8 grid grid-cols-4 justify-items-center gap-x-2 gap-y-5 sm:flex sm:flex-wrap sm:justify-center sm:gap-4 md:mt-12">
          {[
            ["Sage", "#7f9474"],
            ["Blush", "#dfa9a4"],
            ["Terracotta", "#b8674a"],
            ["Teal", "#4f8c86"],
            ["Ivory & gold", "#efe6d2"],
            ["Natural teak", "#9a6a3f"],
            ["Charcoal", "#3b3733"],
          ].map(([name, color]) => (
            <div key={name} className="flex flex-col items-center gap-2 md:gap-3">
              <span
                className="h-14 w-14 rounded-full shadow-inner ring-1 ring-walnut/10 md:h-20 md:w-20"
                style={{ background: color }}
              />
              <span className="text-center text-[0.7rem] font-medium text-umber md:text-xs">{name}</span>
            </div>
          ))}
        </Reveal>
      </section>

      <EnquiryBanner />
    </>
  );
}
