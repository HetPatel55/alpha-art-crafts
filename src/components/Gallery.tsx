"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Photo from "./Photo";
import { ExpandIcon, WhatsAppIcon } from "./Icons";
import { mediaUrl, WIDTHS } from "@/lib/image-loader";
import { designCode, type Photo as PhotoData } from "@/data/gallery";
import { whatsappLink } from "@/data/site";

type Filter = { slug: string; title: string };

type Props = {
  photos: PhotoData[];
  /** Show filter pills; a photo matches a filter by its folder or its `also` tags. */
  filters?: Filter[];
  /** Design library mode: show a design code + enquire button on each tile. */
  designs?: boolean;
};

/**
 * How many tiles to reveal per "Show more" tap: two full rows at every breakpoint.
 * Phones (2 columns) get 4, tablets (3 columns) 6, desktops (4 columns) 8.
 */
const BATCH_QUERIES = [
  { query: "(min-width: 1280px)", size: 8 },
  { query: "(min-width: 768px)", size: 6 },
];
const MOBILE_BATCH = 4;

function subscribe(onChange: () => void) {
  const lists = BATCH_QUERIES.map(({ query }) => window.matchMedia(query));
  lists.forEach((l) => l.addEventListener("change", onChange));
  return () => lists.forEach((l) => l.removeEventListener("change", onChange));
}

function useBatchSize() {
  return useSyncExternalStore(
    subscribe,
    () => BATCH_QUERIES.find(({ query }) => window.matchMedia(query).matches)?.size ?? MOBILE_BATCH,
    () => MOBILE_BATCH,
  );
}

export default function Gallery({ photos, filters, designs }: Props) {
  const batch = useBatchSize();
  const [active, setActive] = useState("all");
  const [batches, setBatches] = useState(1);
  const [index, setIndex] = useState(-1);

  const matching = useMemo(
    () =>
      active === "all"
        ? photos
        : photos.filter((p) => p.category === active || p.also.includes(active)),
    [photos, active],
  );
  const shown = matching.slice(0, batches * batch);
  const remaining = matching.length - shown.length;

  // The lightbox lets people swipe through every matching photo, not only the loaded ones.
  const slides = useMemo(
    () =>
      matching.map((p) => ({
        src: mediaUrl(p.src, 1920),
        width: p.width,
        height: p.height,
        alt: p.title,
        title: designs ? designCode(p.id) : p.title,
        srcSet: WIDTHS.filter((w) => w <= Math.max(p.width, WIDTHS[0])).map((w) => ({
          src: mediaUrl(p.src, w),
          width: w,
          height: Math.round((p.height / p.width) * w),
        })),
      })),
    [matching, designs],
  );

  function selectFilter(slug: string) {
    setActive(slug);
    setBatches(1);
  }

  return (
    <div>
      {filters && (
        <div
          className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:mb-10 md:flex-wrap md:justify-center md:px-0 [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Filter by collection"
        >
          {[{ slug: "all", title: "All" }, ...filters].map((f) => {
            const count =
              f.slug === "all"
                ? photos.length
                : photos.filter((p) => p.category === f.slug || p.also.includes(f.slug)).length;
            const selected = active === f.slug;
            return (
              <button
                key={f.slug}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => selectFilter(f.slug)}
                className={`h-10 shrink-0 rounded-full border px-4 text-[0.82rem] font-medium transition active:scale-95 ${
                  selected ? "border-walnut bg-walnut text-ivory" : "border-walnut/15 bg-white/50"
                }`}
              >
                {f.title}
                <span className={`ml-1.5 text-xs ${selected ? "text-sand" : "text-stone"}`}>{count}</span>
              </button>
            );
          })}
        </div>
      )}

      <ul className="grid grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-4 xl:grid-cols-4 xl:gap-5">
        {shown.map((photo, i) => (
          <li
            key={photo.id}
            className="animate-tile-in"
            style={{ animationDelay: `${(i % batch) * 60}ms` }}
          >
            <figure className="group overflow-hidden rounded-xl bg-cream">
              <button
                type="button"
                onClick={() => setIndex(i)}
                className={`relative block w-full cursor-zoom-in ${designs ? "aspect-square" : "aspect-[4/5]"}`}
                aria-label={`View larger: ${photo.title}`}
              >
                <Photo
                  photo={photo}
                  fill
                  sizes="(min-width: 1280px) 22vw, (min-width: 768px) 31vw, 48vw"
                  className="object-cover transition duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.04]"
                />
                <span className="pointer-events-none absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-ivory/85 text-walnut backdrop-blur-sm md:opacity-0 md:transition md:group-hover:opacity-100">
                  <ExpandIcon size={14} />
                </span>
              </button>

              {designs ? (
                <figcaption className="flex items-center justify-between gap-1.5 bg-ivory px-2 py-2 md:px-3 md:py-2.5">
                  <span className="font-mono text-[0.7rem] tracking-wide text-umber md:text-xs">
                    {designCode(photo.id)}
                  </span>
                  <a
                    href={whatsappLink(
                      `Hi, I'm interested in design ${designCode(photo.id)} from your design library. Could you share the price and size options?`,
                    )}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex h-8 items-center gap-1 rounded-full bg-walnut px-2.5 text-[0.7rem] font-semibold text-ivory transition active:scale-95 md:hover:bg-clay"
                  >
                    <WhatsAppIcon size={12} /> Enquire
                  </a>
                </figcaption>
              ) : (
                <figcaption className="line-clamp-2 px-1 pt-2 pb-1 text-[0.78rem] leading-snug text-umber md:text-sm">
                  {photo.title}
                </figcaption>
              )}
            </figure>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col items-center gap-3 text-center md:mt-12">
        <div className="h-1 w-40 overflow-hidden rounded-full bg-walnut/10" aria-hidden>
          <div
            className="h-full rounded-full bg-clay transition-[width] duration-500"
            style={{ width: `${(shown.length / Math.max(matching.length, 1)) * 100}%` }}
          />
        </div>
        <p className="text-xs text-umber" aria-live="polite">
          Showing {shown.length} of {matching.length}
        </p>
        {remaining > 0 ? (
          <button
            type="button"
            onClick={() => setBatches((b) => b + 1)}
            className="btn btn-outline mt-1 w-full max-w-xs"
          >
            Show {Math.min(batch, remaining)} more
          </button>
        ) : (
          matching.length > batch && (
            <p className="mt-1 max-w-xs text-sm text-umber">
              That&apos;s everything here.{" "}
              <a href={whatsappLink()} target="_blank" rel="noopener" className="font-semibold text-clay underline">
                Ask us on WhatsApp
              </a>{" "}
              for more designs.
            </p>
          )
        )}
      </div>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slides}
        plugins={[Captions, Thumbnails, Zoom]}
        thumbnails={{ width: 64, height: 48, border: 0, gap: 6, imageFit: "cover", padding: 0 }}
        controller={{ closeOnPullDown: true, closeOnBackdropClick: true }}
        carousel={{ finite: false }}
      />
    </div>
  );
}
