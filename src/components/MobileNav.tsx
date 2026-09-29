"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { site, whatsappLink } from "@/data/site";
import { PhoneIcon, WhatsAppIcon } from "./Icons";

function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

const tabs = [
  {
    href: "/",
    label: "Home",
    icon: <Glyph><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z" /></Glyph>,
  },
  {
    href: "/work/",
    label: "Work",
    icon: <Glyph><rect x="3" y="3" width="7.5" height="9" rx="1.5" /><rect x="13.5" y="3" width="7.5" height="5.5" rx="1.5" /><rect x="3" y="15" width="7.5" height="6" rx="1.5" /><rect x="13.5" y="11.5" width="7.5" height="9.5" rx="1.5" /></Glyph>,
  },
  {
    href: "/design-library/",
    label: "Designs",
    icon: <Glyph><path d="M12 3c3 3.5 3 8.5 0 12-3-3.5-3-8.5 0-12Z" /><path d="M12 15c-4 0-7-2-8-5 4-.5 6.5.8 8 5Zm0 0c4 0 7-2 8-5-4-.5-6.5.8-8 5Zm0 0v6" /></Glyph>,
  },
];

/** App-style bottom bar for phones and tablets; replaces the floating WhatsApp button there. */
export default function MobileNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.replace(/\/$/, "")) ||
      (href === "/work/" && pathname.startsWith("/collections"));

  const item = "flex flex-1 flex-col items-center justify-center gap-1 text-[0.65rem] font-semibold tracking-wide";

  return (
    <nav
      aria-label="Quick"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-walnut/10 bg-ivory/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <div className="mx-auto flex h-16 max-w-md items-stretch px-2">
        {tabs.map((tab) => {
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`${item} ${active ? "text-clay" : "text-umber"}`}
            >
              {tab.icon}
              {tab.label}
            </Link>
          );
        })}
        <a href={site.phoneHref} className={`${item} text-umber`}>
          <PhoneIcon size={22} />
          Call
        </a>
        <a href={whatsappLink()} target="_blank" rel="noopener" className={item} aria-label="Chat on WhatsApp">
          <span className="-mt-7 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg ring-4 shadow-black/15 ring-ivory">
            <WhatsAppIcon size={26} />
          </span>
          <span className="text-[#1a9e4b]">WhatsApp</span>
        </a>
      </div>
    </nav>
  );
}
