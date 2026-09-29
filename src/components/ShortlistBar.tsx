"use client";

import { useEffect, useState } from "react";
import Photo from "./Photo";
import { CloseIcon, HeartIcon, WhatsAppIcon } from "./Icons";
import { useShortlist } from "@/lib/shortlist";
import { photoPath, photos } from "@/data/gallery";
import { site, whatsappLink } from "@/data/site";

/** Floating "♡ 3 saved" pill + bottom sheet to review the shortlist and send it on WhatsApp. */
export default function ShortlistBar() {
  const shortlist = useShortlist();
  const [open, setOpen] = useState(false);
  const saved = shortlist.ids.map((id) => photos.find((p) => p.id === id)).filter((p) => p !== undefined);
  const isOpen = open && saved.length > 0;

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  if (saved.length === 0) return null;

  const message = [
    "Hi, I've shortlisted these pieces on your website:",
    "",
    ...saved.map((p, i) => `${i + 1}. ${p.code} — ${p.title}\n${site.url}${photoPath(p)}`),
    "",
    "Could you share prices and size options?",
  ].join("\n");

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] left-1/2 z-40 flex h-12 -translate-x-1/2 items-center gap-2 rounded-full bg-walnut pr-5 pl-4 text-sm font-semibold text-ivory shadow-xl shadow-black/25 transition active:scale-95 lg:bottom-6 lg:left-6 lg:translate-x-0"
      >
        <span key={saved.length} className="flex animate-[heart-pop_0.4s_var(--ease-soft)] text-blush">
          <HeartIcon size={18} filled />
        </span>
        {saved.length} saved · View
      </button>

      <div
        className={`fixed inset-0 z-[60] transition ${isOpen ? "visible" : "invisible"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Your shortlist"
      >
        <button
          type="button"
          aria-label="Close shortlist"
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-ink/50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`absolute inset-x-0 bottom-0 flex max-h-[85svh] flex-col rounded-t-3xl bg-ivory pb-[env(safe-area-inset-bottom)] shadow-2xl transition-transform duration-500 ease-[var(--ease-soft)] md:inset-x-auto md:right-6 md:bottom-6 md:w-[420px] md:rounded-3xl ${
            isOpen ? "translate-y-0" : "translate-y-full md:translate-y-[120%]"
          }`}
        >
          <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-walnut/15 md:hidden" aria-hidden />
          <div className="flex items-center justify-between px-5 pt-4 pb-3">
            <div>
              <h2 className="font-display text-2xl font-medium">Your shortlist</h2>
              <p className="text-xs text-umber">
                {saved.length} {saved.length === 1 ? "piece" : "pieces"} · saved on this device
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-cream"
            >
              <CloseIcon size={20} />
            </button>
          </div>

          <ul className="flex-1 space-y-2 overflow-y-auto px-5 py-1">
            {saved.map((p) => (
              <li key={p.id} className="flex items-center gap-3 rounded-2xl bg-cream p-2">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                  <Photo photo={p} fill sizes="64px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[0.7rem] text-clay">{p.code}</p>
                  <p className="line-clamp-2 text-sm leading-snug">{p.title}</p>
                </div>
                <button
                  type="button"
                  onClick={() => shortlist.remove(p.id)}
                  aria-label={`Remove ${p.code}`}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-umber hover:bg-ivory"
                >
                  <CloseIcon size={18} />
                </button>
              </li>
            ))}
          </ul>

          <div className="grid gap-2 border-t border-walnut/10 px-5 pt-4 pb-5">
            <a href={whatsappLink(message)} target="_blank" rel="noopener" className="btn btn-primary w-full">
              <WhatsAppIcon size={18} /> Send shortlist on WhatsApp
            </a>
            <button
              type="button"
              onClick={() => {
                shortlist.clear();
                setOpen(false);
              }}
              className="h-11 text-sm font-medium text-umber"
            >
              Clear shortlist
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
