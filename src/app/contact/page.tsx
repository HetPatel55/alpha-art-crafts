import type { Metadata } from "next";
import EnquiryForm from "@/components/EnquiryForm";
import Reveal from "@/components/Reveal";
import { PageHero } from "@/components/Sections";
import { MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/Icons";
import { site, whatsappLink } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Enquire about a custom relief panel, murti, carved door or wooden art. Call or WhatsApp ${site.phone}.`,
};

export default function ContactPage() {
  const channels = [
    { Icon: WhatsAppIcon, label: "WhatsApp", value: "Fastest reply", href: whatsappLink() },
    { Icon: PhoneIcon, label: "Call", value: site.phone, href: site.phoneHref },
    site.email && { Icon: MailIcon, label: "Email", value: site.email, href: `mailto:${site.email}` },
    site.address && { Icon: PinIcon, label: "Studio", value: site.address, href: undefined },
  ].filter(Boolean) as { Icon: typeof PhoneIcon; label: string; value: string; href?: string }[];

  return (
    <>
      <PageHero eyebrow="Contact" title={<>Tell us about <em className="text-clay">your space</em></>}>
        <p>
          Share your wall or door size, a photo of the space or a design you love. We&apos;ll suggest a design,
          finish and size — and send you a clear quote.
        </p>
      </PageHero>

      <section className="container-x grid gap-8 py-6 md:gap-14 md:py-24 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <Reveal as="aside">
          <h2 className="font-display text-2xl font-medium md:text-3xl">Reach us directly</h2>
          <ul className="mt-4 grid grid-cols-2 gap-2.5 md:mt-8 md:grid-cols-1 md:gap-3">
            {channels.map(({ Icon, label, value, href }) => {
              const inner = (
                <>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-clay/10 text-clay">
                    <Icon size={20} />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold tracking-wider text-umber uppercase">{label}</span>
                    <span className="mt-0.5 block text-sm font-medium md:text-base">{value}</span>
                  </span>
                </>
              );
              return (
                <li key={label}>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener"
                      className="flex h-full flex-col items-start gap-3 rounded-2xl border border-walnut/10 p-4 transition active:bg-cream md:flex-row md:items-center md:gap-4 md:hover:border-clay/40 md:hover:bg-cream"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className="flex h-full flex-col items-start gap-3 rounded-2xl border border-walnut/10 p-4 md:flex-row md:items-center md:gap-4">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
          {site.hours && <p className="mt-6 text-sm text-umber">Open {site.hours}</p>}
        </Reveal>

        <Reveal delay={120} className="grain -mx-4 bg-cream px-4 py-7 md:mx-0 md:rounded-3xl md:p-10">
          <h2 className="font-display text-2xl font-medium md:text-3xl">Send an enquiry</h2>
          <p className="mt-1 mb-6 text-sm text-umber md:mt-2 md:mb-8">Takes under a minute.</p>
          <EnquiryForm />
        </Reveal>
      </section>
    </>
  );
}
