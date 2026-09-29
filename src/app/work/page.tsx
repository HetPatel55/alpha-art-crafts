import type { Metadata } from "next";
import Gallery from "@/components/Gallery";
import { EnquiryBanner, PageHero } from "@/components/Sections";
import { collections, portfolioPhotos } from "@/data/gallery";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Portfolio of carved religious art, floral and nature wall panels, doors and entryways, wooden art and furniture by Alpha Art & Crafts.",
};

export default function WorkPage() {
  return (
    <>
      <PageHero eyebrow="Portfolio" title={<>Our <em className="text-clay">work</em></>}>
        <p>
          A selection of murtis, wall panels, doors and wooden art we&apos;ve designed and carved. Every piece is
          made to order — the size, colour and detailing can all be adapted to your space.
        </p>
      </PageHero>
      <section className="container-x py-6 md:py-20">
        <Gallery
          photos={portfolioPhotos}
          filters={[...collections.map(({ slug, title }) => ({ slug, title })), { slug: "workshop", title: "Workshop" }]}
        />
      </section>
      <EnquiryBanner />
    </>
  );
}
