import Link from "next/link";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import { ArrowRight, ArrowUpRight, WhatsAppIcon } from "@/components/Icons";
import { EnquiryBanner, ProcessSteps, SectionHeading, SwipeHint } from "@/components/Sections";
import { collections, designPhotos, getPhoto, photosFor, workshopPhotos } from "@/data/gallery";
import { whatsappLink } from "@/data/site";

const craftWords = [
  "Religious murtis",
  "Floral wall panels",
  "Carved mandir doors",
  "Trees of life",
  "Temple arches",
  "Solid-wood furniture",
  "Nature reliefs",
  "Custom designs",
];

// Desktop bento layout for the five collection cards (phones get a swipe rail instead).
const collectionLayout = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-4", "lg:col-span-4", "lg:col-span-4"];

export default function Home() {
  const hero = ["religious-art-08", "wall-panels-03", "doors-entryways-01"].map(getPhoto);
  const lifestyle = getPhoto("lifestyle-01");

  return (
    <>
      {/* ───────── Hero ───────── */}
      <section className="grain relative overflow-hidden bg-walnut text-ivory">
        <div className="container-x grid items-center gap-8 pt-24 pb-10 lg:min-h-[100svh] lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-24 lg:pb-16">
          <div>
            <Reveal>
              <p className="eyebrow !text-blush">Wooden relief art · Made to order</p>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="mt-4 font-display text-[2.7rem] leading-[1] font-medium text-balance sm:text-6xl lg:mt-6 xl:text-[5.6rem]">
                Walls that tell <em className="text-blush">stories</em>, carved by hand.
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-sand/85 md:mt-7 md:text-lg">
                Bespoke murtis, floral wall panels, carved doors and wooden art — made to your size and
                hand-finished for homes and temples.
              </p>
            </Reveal>
            <Reveal delay={300} className="mt-6 grid grid-cols-2 gap-2.5 sm:flex sm:gap-3 md:mt-10">
              <Link href="/work/" className="btn btn-primary !px-4">
                Our work <ArrowRight size={17} />
              </Link>
              <a href={whatsappLink()} target="_blank" rel="noopener" className="btn btn-outline-light !px-4">
                <WhatsAppIcon size={17} /> Get a quote
              </a>
            </Reveal>
          </div>

          <div className="relative grid h-[360px] grid-cols-2 grid-rows-2 gap-2.5 sm:h-[460px] md:gap-4 lg:h-[min(78vh,640px)]">
            <div className="relative row-span-2 overflow-hidden rounded-t-[999px] rounded-b-2xl">
              <Photo photo={hero[0]} fill preload sizes="(min-width:1024px) 25vw, 50vw" className="animate-hero-zoom object-cover" />
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              <Photo photo={hero[1]} fill preload sizes="(min-width:1024px) 25vw, 50vw" className="animate-hero-zoom object-cover object-top" />
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              <Photo photo={hero[2]} fill preload sizes="(min-width:1024px) 25vw, 50vw" className="animate-hero-zoom object-cover" />
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="border-t border-sand/10 py-3.5 md:py-5" aria-hidden>
          <div className="flex w-max animate-marquee">
            {[...craftWords, ...craftWords].map((word, i) => (
              <span key={i} className="flex items-center gap-6 pr-6 font-display text-lg text-sand/70 italic md:gap-8 md:pr-8 md:text-2xl">
                {word}
                <span className="h-1.5 w-1.5 rotate-45 bg-clay" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Intro ───────── */}
      <section className="container-x section-y">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-24">
          <Reveal>
            <p className="eyebrow">The studio</p>
            <p className="mt-4 font-display text-[1.7rem] leading-[1.2] text-balance md:mt-6 md:text-5xl">
              We turn plain walls and doorways into <em className="text-clay">heirloom pieces</em> — carved
              with precision, finished by hand.
            </p>
          </Reveal>
          <div className="grid grid-cols-3 gap-3 lg:grid-cols-1 lg:content-end lg:gap-8">
            {[
              ["Made to measure", "Every piece is sized, coloured and detailed for your wall or door."],
              ["Hand-finished", "CNC precision for the carving, human hands for the finish."],
              ["Pan-India delivery", "Packed with care and shipped with installation guidance."],
            ].map(([title, text], i) => (
              <Reveal key={title} delay={i * 100} className="rounded-xl bg-cream p-3 lg:rounded-none lg:border-t lg:border-walnut/15 lg:bg-transparent lg:p-0 lg:pt-5">
                <h3 className="font-display text-[1.05rem] leading-tight font-medium md:text-2xl">{title}</h3>
                <p className="mt-2 hidden text-sm leading-relaxed text-umber md:block">{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Collections ───────── */}
      <section className="container-x pb-14 md:pb-24 lg:pb-32">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading eyebrow="Collections" title="Explore by what you're creating" />
          <Link href="/work/" className="hidden items-center gap-2 text-sm font-semibold md:inline-flex">
            View all work <ArrowRight size={16} />
          </Link>
        </div>
        <SwipeHint />

        <div className="rail mt-4 lg:mx-0 lg:mt-12 lg:grid lg:grid-cols-12 lg:grid-rows-[460px_380px] lg:gap-5 lg:overflow-visible lg:px-0">
          {collections.map((c, i) => (
            <Reveal key={c.slug} delay={i * 80} className={`w-[78vw] max-w-sm sm:w-[46vw] lg:w-auto lg:max-w-none ${collectionLayout[i]}`}>
              <Link
                href={`/collections/${c.slug}/`}
                className="group relative block h-[420px] overflow-hidden rounded-2xl bg-cream lg:h-full"
              >
                <Photo
                  photo={getPhoto(c.cover)}
                  fill
                  sizes={i < 2 ? "(min-width:1024px) 55vw, 80vw" : "(min-width:1024px) 33vw, 80vw"}
                  className="object-cover transition duration-1000 ease-[var(--ease-soft)] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white md:p-7">
                  <div>
                    <p className="text-[0.68rem] font-semibold tracking-[0.18em] text-blush uppercase">
                      {photosFor(c.slug).length} pieces · {c.short}
                    </p>
                    <h3 className={`mt-1.5 font-display font-medium ${i < 2 ? "text-3xl lg:text-5xl" : "text-3xl"}`}>
                      {c.title}
                    </h3>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 transition duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-walnut">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <Link href="/work/" className="btn btn-outline mt-6 w-full md:hidden">
          View all work <ArrowRight size={16} />
        </Link>
      </section>

      {/* ───────── In your space ───────── */}
      <section className="grain section-y bg-cream">
        <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative">
            <div className="relative aspect-[5/6] overflow-hidden rounded-t-[999px] rounded-b-3xl md:aspect-[4/5]">
              <Photo photo={lifestyle} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-4 left-3 rounded-2xl bg-ivory px-4 py-3 shadow-xl md:-bottom-6 md:-left-8 md:p-6">
              <p className="font-display text-3xl text-clay italic md:text-4xl">100%</p>
              <p className="mt-0.5 text-[0.65rem] font-semibold tracking-wider text-umber uppercase md:text-xs">Custom to your wall</p>
            </div>
          </Reveal>
          <div>
            <SectionHeading eyebrow="Lifestyle" title={<>See it in your space <em className="text-clay">before</em> we carve</>}>
              <p>
                We create mockups that place the design on your wall — so you can decide size, colour and
                placement with confidence.
              </p>
            </SectionHeading>
            <Reveal delay={150} className="mt-7 grid gap-2.5 sm:flex sm:gap-3 md:mt-9">
              <Link href="/collections/lifestyle/" className="btn btn-dark">
                View mockups <ArrowRight size={18} />
              </Link>
              <a
                href={whatsappLink("Hi, I'd like a mockup of one of your designs on my wall. I'll share a photo.")}
                target="_blank"
                rel="noopener"
                className="btn btn-outline"
              >
                Request a mockup
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────── Workshop strip ───────── */}
      <section className="section-y">
        <div className="container-x">
          <SectionHeading eyebrow="From our workshop" title="Real pieces, fresh off the bench">
            <p>Every carving is made in-house. A look at recent work before it leaves the studio.</p>
          </SectionHeading>
          <SwipeHint />
          <div className="rail mt-4 md:mt-10 md:gap-5">
            {workshopPhotos.map((photo) => (
              <figure key={photo.id} className="w-[62vw] sm:w-[40vw] lg:w-[22vw]">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-cream">
                  <Photo photo={photo} fill sizes="(min-width:1024px) 22vw, (min-width:640px) 40vw, 62vw" className="object-cover" />
                </div>
                <figcaption className="mt-2 line-clamp-2 text-[0.8rem] leading-snug text-umber md:text-sm">{photo.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Process ───────── */}
      <section className="grain section-y bg-walnut text-ivory">
        <div className="container-x">
          <div className="mb-6 flex flex-col justify-between gap-6 md:mb-14 md:flex-row md:items-end">
            <Reveal className="max-w-2xl">
              <p className="eyebrow !text-blush">How we work</p>
              <h2 className="mt-3 font-display text-[2.1rem] leading-[1.05] font-medium md:mt-4 md:text-6xl">
                From your idea to your wall, in four steps
              </h2>
            </Reveal>
            <Reveal className="hidden md:block">
              <Link href="/about/" className="link-underline inline-flex items-center gap-2 text-sm font-semibold">
                About the studio <ArrowRight size={16} />
              </Link>
            </Reveal>
          </div>
          <SwipeHint light />
          <ProcessSteps dark />
        </div>
      </section>

      {/* ───────── Design library teaser ───────── */}
      <section className="container-x section-y">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow="Design library" title={<>{designPhotos.length} designs, ready to carve</>}>
              <p>
                Florals, nature, abstract and sacred relief designs. Pick one, quote its code on WhatsApp, and
                we&apos;ll carve it to your size and colour.
              </p>
            </SectionHeading>
            <Link href="/design-library/" className="btn btn-dark mt-9 hidden lg:inline-flex">
              Browse the library <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {designPhotos.slice(0, 6).map((photo, i) => (
              <Reveal key={photo.id} delay={i * 60} className={i % 3 === 1 ? "translate-y-5 md:translate-y-8" : ""}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-cream md:rounded-xl">
                  <Photo photo={photo} fill sizes="(min-width:1024px) 18vw, 33vw" className="object-cover" />
                </div>
              </Reveal>
            ))}
          </div>
          <Link href="/design-library/" className="btn btn-dark mt-4 w-full lg:hidden">
            Browse the library <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <EnquiryBanner />
    </>
  );
}
