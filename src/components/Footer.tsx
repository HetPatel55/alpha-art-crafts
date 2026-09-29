import Link from "next/link";
import Logo from "./Logo";
import { collections } from "@/data/gallery";
import { site, whatsappLink } from "@/data/site";
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "./Icons";

export default function Footer() {
  const socials = [
    site.instagram && { href: site.instagram, label: "Instagram", Icon: InstagramIcon },
    site.facebook && { href: site.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: whatsappLink(), label: "WhatsApp", Icon: WhatsAppIcon },
  ].filter(Boolean) as { href: string; label: string; Icon: typeof WhatsAppIcon }[];

  return (
    <footer className="grain bg-walnut text-sand">
      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:py-20 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="col-span-2 text-ivory lg:col-span-1">
          <Logo />
          <p className="mt-5 max-w-sm text-[0.85rem] leading-relaxed text-sand/80">{site.tagline}. Designed and hand-finished to order for homes, temples and commercial interiors.</p>
          <div className="mt-6 flex gap-2">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener"
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-sand/20 transition hover:border-clay hover:bg-clay"
              >
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="eyebrow !text-stone">Collections</h2>
          <ul className="mt-4 space-y-3.5 text-sm">
            {collections.map((c) => (
              <li key={c.slug}>
                <Link href={`/collections/${c.slug}/`} className="link-underline hover:text-ivory">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow !text-stone">Studio</h2>
          <ul className="mt-4 space-y-3.5 text-sm">
            <li><Link href="/work/" className="link-underline hover:text-ivory">All work</Link></li>
            <li><Link href="/design-library/" className="link-underline hover:text-ivory">Design library</Link></li>
            <li><Link href="/about/" className="link-underline hover:text-ivory">About &amp; process</Link></li>
            <li><Link href="/contact/" className="link-underline hover:text-ivory">Contact</Link></li>
          </ul>
        </div>

        <div className="col-span-2 lg:col-span-1">
          <h2 className="eyebrow !text-stone">Get in touch</h2>
          <ul className="mt-5 space-y-4 text-sm">
            <li>
              <a href={site.phoneHref} className="flex items-center gap-3 hover:text-ivory">
                <PhoneIcon size={17} className="text-clay" /> {site.phone}
              </a>
            </li>
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener" className="flex items-center gap-3 hover:text-ivory">
                <WhatsAppIcon size={17} className="text-clay" /> WhatsApp us
              </a>
            </li>
            {site.email && (
              <li>
                <a href={`mailto:${site.email}`} className="flex items-center gap-3 hover:text-ivory">
                  <MailIcon size={17} className="text-clay" /> {site.email}
                </a>
              </li>
            )}
            {site.address && (
              <li className="flex items-start gap-3">
                <PinIcon size={17} className="mt-0.5 shrink-0 text-clay" /> {site.address}
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-sand/10">
        <div className="container-x flex flex-col gap-1.5 py-5 text-[0.7rem] text-stone sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.legalName}. All rights reserved.</p>
          <p>Designed &amp; carved in India · Delivered pan-India</p>
        </div>
      </div>
    </footer>
  );
}
