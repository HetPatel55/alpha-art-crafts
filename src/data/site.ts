// Business details used across the whole site. Edit here, not in components.

export const site = {
  name: "Alpha Art & Crafts",
  legalName: "Alpha Art and Crafts",
  tagline: "Carved relief art for walls, doors & sacred spaces",
  description:
    "Alpha Art & Crafts designs and hand-finishes bespoke wooden relief art — religious murtis and murals, floral and nature wall panels, carved doors and entryways, and solid-wood furniture, made to measure for homes, temples, hospitality and commercial interiors.",
  // Change this if you connect a custom domain, e.g. "https://alphaartcrafts.in"
  url: "https://alpha-art-crafts.vercel.app",

  phone: "+91 93282 19790",
  phoneHref: "tel:+919328219790",
  whatsapp: "919328219790",
  // TODO: fill these in when available — empty values are hidden on the site.
  email: "",
  address: "",
  city: "",
  instagram: "",
  facebook: "",
  hours: "", // e.g. "Mon – Sat, 10 am – 7 pm"
} as const;

export function whatsappLink(message = "Hi, I saw your website and I'm interested in your work.") {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
