"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { collections } from "@/data/gallery";
import { whatsappLink } from "@/data/site";
import { WhatsAppIcon } from "./Icons";

const nav = [
  { href: "/work/", label: "Our Work" },
  { href: "/design-library/", label: "Design Library" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  // The menu remembers which page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  // Desktop Collections dropdown opens on hover/focus; after picking a collection it stays
  // closed until the pointer leaves, otherwise hover + the focused link would keep it open.
  const [dropdownDismissed, setDropdownDismissed] = useState(false);

  function dismissDropdown() {
    setDropdownDismissed(true);
    (document.activeElement as HTMLElement | null)?.blur();
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const transparent = isHome && !scrolled && !open;

  const isActive = (href: string) =>
    pathname.startsWith(href.replace(/\/$/, ""));

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow] duration-500 ${
          transparent
            ? "bg-transparent text-white"
            : "bg-ivory/90 text-walnut shadow-[0_1px_0_rgb(43_31_23/0.08)] backdrop-blur-md"
        }`}
      >
        <div className="container-x flex h-16 items-center justify-between md:h-20">
          <Logo />

          <nav className="hidden items-center gap-9 lg:flex" aria-label="Main">
            <div className="group relative" onMouseLeave={() => setDropdownDismissed(false)}>
              <Link
                href="/work/"
                className={`py-6 text-sm font-medium tracking-wide ${pathname.startsWith("/collections") ? "text-clay" : ""}`}
              >
                Collections
              </Link>
              <div
                className={`invisible absolute top-full left-1/2 w-72 -translate-x-1/2 translate-y-2 opacity-0 transition duration-300 ${
                  dropdownDismissed
                    ? ""
                    : "group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"
                }`}
              >
                <div className="rounded-2xl bg-ivory p-2 text-walnut shadow-xl ring-1 ring-walnut/5">
                  {collections.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/collections/${c.slug}/`}
                      onClick={dismissDropdown}
                      aria-current={pathname.startsWith(`/collections/${c.slug}`) ? "page" : undefined}
                      className="flex items-baseline justify-between rounded-xl px-4 py-3 transition hover:bg-cream aria-[current=page]:text-clay"
                    >
                      <span className="font-display text-lg">{c.title}</span>
                      <span className="text-xs text-umber">{c.short}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`link-underline text-sm font-medium tracking-wide ${
                  isActive(item.href) ? "text-clay" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener"
              className={`btn hidden !py-2.5 sm:inline-flex ${transparent ? "btn-outline-light" : "btn-dark"}`}
            >
              <WhatsAppIcon size={16} /> Enquire
            </a>
            <button
              type="button"
              onClick={() => setOpenOn(open ? null : pathname)}
              className="relative flex h-11 w-11 items-center justify-center lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <span
                className={`absolute h-px w-6 bg-current transition duration-300 ${open ? "rotate-45" : "-translate-y-1.5"}`}
              />
              <span
                className={`absolute h-px w-6 bg-current transition duration-300 ${open ? "-rotate-45" : "translate-y-1.5"}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-[45] overflow-y-auto bg-ivory pt-20 pb-28 transition duration-500 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav className="container-x flex flex-col" aria-label="Mobile">
          <p className="eyebrow mb-3">Collections</p>
          {collections.map((c) => (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}/`}
              className="flex items-baseline justify-between border-b border-walnut/10 py-3.5"
            >
              <span className="font-display text-[1.6rem]">{c.title}</span>
              <span className="text-xs text-umber">{c.short}</span>
            </Link>
          ))}
          <div className="mt-8 flex flex-col gap-1">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="py-2 font-display text-3xl">
                {item.label}
              </Link>
            ))}
          </div>
          <a href={whatsappLink()} target="_blank" rel="noopener" className="btn btn-primary mt-10">
            <WhatsAppIcon size={18} /> Chat on WhatsApp
          </a>
        </nav>
      </div>
    </>
  );
}
