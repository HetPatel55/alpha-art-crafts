import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Gallery from "@/components/Gallery";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import { ArrowRight, WhatsAppIcon } from "@/components/Icons";
import { EnquiryBanner } from "@/components/Sections";
import { collections, getCollection, getPhoto, photosFor } from "@/data/gallery";
import { whatsappLink } from "@/data/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return {};
  return { title: collection.title, description: collection.intro };
}

export default async function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const items = photosFor(slug);
  const cover = getPhoto(collection.cover);
  const index = collections.findIndex((c) => c.slug === slug);
  const next = collections[(index + 1) % collections.length];

  return (
    <>
      {/* Phones: full-bleed cover with the title over it */}
      <section className="relative h-[62svh] min-h-[420px] overflow-hidden bg-walnut lg:hidden">
        <Photo photo={cover} fill preload sizes="100vw" className="animate-hero-zoom object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-ink/40" />
        <div className="container-x absolute inset-x-0 bottom-0 pb-7 text-white">
          <p className="eyebrow !text-blush">{collection.tagline}</p>
          <h1 className="mt-2 font-display text-[2.6rem] leading-[1] font-medium">{collection.title}</h1>
        </div>
      </section>

      <section className="grain bg-cream pt-6 lg:pt-28">
        <div className="container-x grid items-center gap-10 pb-8 lg:grid-cols-[1.3fr_1fr] lg:gap-20 lg:pb-14">
          <Reveal>
            <nav aria-label="Breadcrumb" className="text-xs font-medium tracking-wide text-umber">
              <Link href="/work/" className="hover:text-clay">Our work</Link>
              <span className="mx-2 text-stone">/</span>
              <span>{collection.title}</span>
            </nav>
            <p className="eyebrow mt-8 hidden lg:block">{collection.tagline}</p>
            <h2 className="mt-4 hidden font-display text-6xl leading-[1.02] font-medium lg:block xl:text-7xl">{collection.title}</h2>
            <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-umber lg:mt-6 lg:text-lg">{collection.intro}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-9">
              <a
                href={whatsappLink(`Hi, I'm interested in your ${collection.title} work. Could you help me with a design and quote?`)}
                target="_blank"
                rel="noopener"
                className="btn btn-primary"
              >
                <WhatsAppIcon size={18} /> Enquire on WhatsApp
              </a>
            </div>
          </Reveal>
          {/* Height is capped so the title and intro always fit on screen beside it. */}
          <Reveal
            delay={150}
            className="relative hidden h-[min(calc(100svh-10rem),600px)] w-full max-w-[480px] justify-self-end overflow-hidden rounded-t-[999px] rounded-b-3xl lg:block"
          >
            <Photo photo={cover} fill sizes="40vw" className="object-cover" />
          </Reveal>
        </div>
      </section>

      <section className="container-x py-8 md:py-20">
        <p className="mb-4 text-xs text-umber md:mb-8 md:text-sm">
          {items.length} {items.length === 1 ? "piece" : "pieces"} · tap a photo to view full-screen
        </p>
        <Gallery photos={items} />
      </section>

      <section className="container-x">
        <Link
          href={`/collections/${next.slug}/`}
          className="group flex items-center justify-between gap-6 border-y border-walnut/15 py-7 md:py-14"
        >
          <div>
            <p className="eyebrow">Next collection</p>
            <p className="mt-2 font-display text-3xl font-medium transition group-hover:text-clay md:mt-3 md:text-6xl">
              {next.title}
            </p>
          </div>
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-walnut/20 transition group-hover:border-clay group-hover:bg-clay group-hover:text-white md:h-20 md:w-20">
            <ArrowRight size={24} />
          </span>
        </Link>
      </section>

      <EnquiryBanner />
    </>
  );
}
