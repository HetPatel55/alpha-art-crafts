import type { Metadata } from "next";
import Gallery from "@/components/Gallery";
import { EnquiryBanner, PageHero } from "@/components/Sections";
import { designPhotos } from "@/data/gallery";

export const metadata: Metadata = {
  title: "Design Library",
  description:
    "Browse ready-to-carve relief designs — florals, trees, birds, waves and abstract textures. Quote the design code and we'll carve it to your size.",
};

export default function DesignLibraryPage() {
  return (
    <>
      <PageHero eyebrow="Design library" title={<>Pick a design. <em className="text-clay">We&apos;ll carve it</em> to your size.</>}>
        <p>
          A catalogue of {designPhotos.length} relief designs — florals, branches, cranes, waves and abstract
          textures. Each has a code: tap <strong className="font-semibold text-walnut">Enquire</strong> to send it
          to us on WhatsApp and we&apos;ll reply with sizes, finishes and a quote.
        </p>
      </PageHero>
      <section className="container-x py-6 md:py-20">
        <Gallery photos={designPhotos} designs />
      </section>
      <EnquiryBanner
        title="Have your own design in mind?"
        text="Send us a sketch, a Pinterest pin or a photo from anywhere — we can adapt almost any motif into a carved relief."
      />
    </>
  );
}
