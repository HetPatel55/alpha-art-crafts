"use client";

import { useMemo, useRef, useState, useSyncExternalStore, type TouchEvent } from "react";
import Lightbox, { useLightboxState } from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Photo from "./Photo";
import { ChevronLeft, ChevronRight, ExpandIcon, HeartIcon, ShareIcon, WhatsAppIcon } from "./Icons";
import { mediaUrl, WIDTHS } from "@/lib/image-loader";
import { useSearchParams } from "@/lib/url-state";
import { useShortlist } from "@/lib/shortlist";
import { sharePhoto } from "@/lib/share";
import { photoPath, type Photo as PhotoData } from "@/data/gallery";
import { site, whatsappLink } from "@/data/site";

type Filter = { slug: string; title: string };

type Props = {
  photos: PhotoData[];
  /** Filter pills; a photo matches when the slug is in its `tags`. */
  filters?: Filter[];
  /** Design library mode: square tiles with the design code and an enquire button. */
  designs?: boolean;
};

/**
 * Photos per page: two full rows at every breakpoint so every page is the same size.
 * Phones (2 columns) show 4, tablets (3 columns) 6, desktops (4 columns) 8.
 */
const PAGE_QUERIES = [
  { query: "(min-width: 1280px)", size: 8 },
  { query: "(min-width: 768px)", size: 6 },
];
const MOBILE_PAGE_SIZE = 4;

function subscribeToBreakpoints(onChange: () => void) {
  const lists = PAGE_QUERIES.map(({ query }) => window.matchMedia(query));
  lists.forEach((l) => l.addEventListener("change", onChange));
  return () => lists.forEach((l) => l.removeEventListener("change", onChange));
}

function usePageSize() {
  return useSyncExternalStore(
    subscribeToBreakpoints,
    () => PAGE_QUERIES.find(({ query }) => window.matchMedia(query).matches)?.size ?? MOBILE_PAGE_SIZE,
    () => MOBILE_PAGE_SIZE,
  );
}

export function enquiryLink(photo: PhotoData) {
  return whatsappLink(
    `Hi, I'm interested in ${photo.code} — ${photo.title}. Could you share the price and size options?\n${site.url}${photoPath(photo)}`,
  );
}

export default function Gallery({ photos, filters, designs }: Props) {
  const pageSize = usePageSize();
  const params = useSearchParams();
  const shortlist = useShortlist();
  const gridTop = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const filterParam = params.get("filter");
  const active = filters?.some((f) => f.slug === filterParam) ? filterParam! : "all";
  const matching = useMemo(
    () => (active === "all" ? photos : photos.filter((p) => p.tags.includes(active))),
    [photos, active],
  );

  const totalPages = Math.max(1, Math.ceil(matching.length / pageSize));
  const page = Math.min(Math.max(1, Number(params.get("page")) || 1), totalPages);
  const start = (page - 1) * pageSize;
  const shown = matching.slice(start, start + pageSize);
  const fillers = totalPages > 1 ? pageSize - shown.length : 0;

  // Lightbox: open photo is ?view=<id>; it swipes through every matching photo, not just this page.
  const viewId = params.get("view");
  const lightboxPhotos = matching.some((p) => p.id === viewId) ? matching : photos;
  const viewIndex = lightboxPhotos.findIndex((p) => p.id === viewId);
  const slides = useMemo(
    () =>
      lightboxPhotos.map((p) => ({
        src: mediaUrl(p.src, 1920),
        width: p.width,
        height: p.height,
        alt: p.title,
        srcSet: WIDTHS.filter((w) => w <= Math.max(p.width, WIDTHS[0])).map((w) => ({
          src: mediaUrl(p.src, w),
          width: w,
          height: Math.round((p.height / p.width) * w),
        })),
      })),
    [lightboxPhotos],
  );

  function goToPage(next: number) {
    if (next < 1 || next > totalPages || next === page) return;
    setDirection(next > page ? "next" : "prev");
    params.set({ page: next === 1 ? null : String(next) });
    requestAnimationFrame(() => {
      const top = gridTop.current?.getBoundingClientRect().top ?? 0;
      if (top < 0 || top > window.innerHeight * 0.4) {
        gridTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  function selectFilter(slug: string) {
    setDirection("next");
    params.set({ filter: slug === "all" ? null : slug, page: null });
  }

  function openPhoto(photo: PhotoData) {
    params.set({ view: photo.id }, { push: true });
  }

  function closeLightbox() {
    // Opening pushed a history entry, so going back closes it and keeps Back intuitive.
    if (window.history.state?.aac) window.history.back();
    else params.set({ view: null });
  }

  function onTouchStart(e: TouchEvent) {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }

  function onTouchEnd(e: TouchEvent) {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) goToPage(dx < 0 ? page + 1 : page - 1);
  }

  return (
    <div>
      {filters && (
        <div
          className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:mb-10 md:flex-wrap md:justify-center md:px-0 [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Filter"
        >
          {[{ slug: "all", title: "All" }, ...filters].map((f) => {
            const count = f.slug === "all" ? photos.length : photos.filter((p) => p.tags.includes(f.slug)).length;
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

      <div ref={gridTop} className="scroll-mt-20 md:scroll-mt-24" />

      <ul
        key={`${active}-${page}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={`grid touch-pan-y grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-4 xl:grid-cols-4 xl:gap-5 ${
          direction === "next" ? "animate-page-next" : "animate-page-prev"
        }`}
        aria-label={`Page ${page} of ${totalPages}`}
      >
        {shown.map((photo) => {
          const saved = shortlist.has(photo.id);
          return (
            <li key={photo.id}>
              <figure className="group relative overflow-hidden rounded-xl bg-cream">
                <button
                  type="button"
                  onClick={() => openPhoto(photo)}
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

                <button
                  type="button"
                  onClick={() => shortlist.toggle(photo.id)}
                  aria-pressed={saved}
                  aria-label={saved ? `Remove ${photo.code} from shortlist` : `Save ${photo.code} to shortlist`}
                  className={`absolute top-2 left-2 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition active:scale-90 ${
                    saved ? "bg-clay text-white" : "bg-ivory/85 text-walnut"
                  }`}
                >
                  <HeartIcon size={17} filled={saved} />
                </button>

                {designs ? (
                  <figcaption className="flex items-center justify-between gap-1.5 bg-ivory px-2 py-2 md:px-3 md:py-2.5">
                    <span className="font-mono text-[0.7rem] tracking-wide text-umber md:text-xs">{photo.code}</span>
                    <a
                      href={enquiryLink(photo)}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex h-8 items-center gap-1 rounded-full bg-walnut px-2.5 text-[0.7rem] font-semibold text-ivory transition active:scale-95 md:hover:bg-clay"
                    >
                      <WhatsAppIcon size={12} /> Enquire
                    </a>
                  </figcaption>
                ) : (
                  <figcaption className="px-1 pt-2 pb-1">
                    <span className="font-mono text-[0.65rem] tracking-wide text-clay md:text-xs">{photo.code}</span>
                    <span className="mt-0.5 line-clamp-2 block text-[0.78rem] leading-snug text-umber md:text-sm">
                      {photo.title}
                    </span>
                  </figcaption>
                )}
              </figure>
            </li>
          );
        })}
        {Array.from({ length: fillers }, (_, i) => (
          <li key={`filler-${i}`} aria-hidden className="invisible">
            <div className={designs ? "aspect-square" : "aspect-[4/5]"} />
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
      )}

      <Lightbox
        open={viewIndex >= 0}
        index={Math.max(viewIndex, 0)}
        close={closeLightbox}
        slides={slides}
        className="aac-lightbox"
        plugins={pageSize > MOBILE_PAGE_SIZE ? [Thumbnails, Zoom] : [Zoom]}
        thumbnails={{ width: 64, height: 48, border: 0, gap: 6, imageFit: "cover", padding: 0 }}
        styles={{
          container: { backgroundColor: "rgb(20 14 10 / 0.97)" },
          thumbnailsContainer: { backgroundColor: "rgb(20 14 10 / 0.97)" },
        }}
        controller={{ closeOnPullDown: true, closeOnBackdropClick: true }}
        carousel={{ finite: false }}
        on={{
          view: ({ index }) => {
            const id = lightboxPhotos[index]?.id;
            if (id && id !== params.get("view")) params.set({ view: id });
          },
        }}
        render={{ controls: () => <LightboxPanel photos={lightboxPhotos} /> }}
      />
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  // 1 … 4 5 6 … 9 — the current page, its neighbours, and both ends.
  const numbers: (number | "gap")[] = [];
  for (let n = 1; n <= totalPages; n++) {
    if (n === 1 || n === totalPages || Math.abs(n - page) <= 1) numbers.push(n);
    else if (numbers[numbers.length - 1] !== "gap") numbers.push("gap");
  }

  const arrow =
    "flex h-12 items-center gap-1.5 rounded-full border border-walnut/15 px-4 text-sm font-semibold transition active:scale-95 disabled:pointer-events-none disabled:opacity-35 md:hover:border-walnut";

  return (
    <nav aria-label="Pages" className="mt-6 flex items-center justify-between gap-3 md:mt-10 md:justify-center">
      <button type="button" className={arrow} onClick={() => onChange(page - 1)} disabled={page === 1}>
        <ChevronLeft size={18} /> Prev
      </button>

      {/* Phones: compact counter. Larger screens: page numbers. */}
      <p className="text-sm text-umber md:hidden" aria-live="polite">
        Page <strong className="font-semibold text-walnut">{page}</strong> of {totalPages}
      </p>
      <ol className="hidden items-center gap-1.5 md:flex">
        {numbers.map((n, i) =>
          n === "gap" ? (
            <li key={`gap-${i}`} className="w-6 text-center text-stone" aria-hidden>
              …
            </li>
          ) : (
            <li key={n}>
              <button
                type="button"
                onClick={() => onChange(n)}
                aria-current={n === page ? "page" : undefined}
                className={`h-11 w-11 rounded-full text-sm font-semibold transition ${
                  n === page ? "bg-walnut text-ivory" : "hover:bg-cream"
                }`}
              >
                {n}
              </button>
            </li>
          ),
        )}
      </ol>

      <button type="button" className={arrow} onClick={() => onChange(page + 1)} disabled={page === totalPages}>
        Next <ChevronRight size={18} />
      </button>
    </nav>
  );
}

/** Bottom panel inside the full-screen viewer: code, title, save, share and enquire. */
function LightboxPanel({ photos }: { photos: PhotoData[] }) {
  const { currentIndex } = useLightboxState();
  const shortlist = useShortlist();
  const photo = photos[currentIndex];
  if (!photo) return null;
  const saved = shortlist.has(photo.id);

  const round =
    "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/25 text-white transition active:scale-90";

  return (
    <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/60 to-transparent px-4 pt-10 pb-[max(1rem,env(safe-area-inset-bottom))] text-white">
      <div className="mx-auto max-w-xl">
        <p className="font-mono text-xs tracking-wider text-blush">{photo.code}</p>
        <p className="mt-1 line-clamp-2 font-display text-lg leading-snug md:text-xl">{photo.title}</p>
        <div className="mt-3 flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => shortlist.toggle(photo.id)}
            aria-pressed={saved}
            aria-label={saved ? "Remove from shortlist" : "Save to shortlist"}
            className={`${round} ${saved ? "border-clay bg-clay" : ""}`}
          >
            <HeartIcon size={20} filled={saved} />
          </button>
          <button type="button" onClick={() => sharePhoto(photo)} aria-label="Share" className={round}>
            <ShareIcon size={20} />
          </button>
          <a
            href={enquiryLink(photo)}
            target="_blank"
            rel="noopener"
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-semibold text-white transition active:scale-[0.98]"
          >
            <WhatsAppIcon size={18} /> Enquire about this
          </a>
        </div>
      </div>
    </div>
  );
}
