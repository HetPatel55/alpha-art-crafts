"use client";

import { useState, type FormEvent } from "react";
import { collections } from "@/data/gallery";
import { whatsappLink } from "@/data/site";
import { WhatsAppIcon } from "./Icons";

const fieldClass =
  "w-full rounded-xl border border-walnut/15 bg-white/60 px-4 py-3.5 text-base outline-none transition placeholder:text-stone focus:border-clay focus:bg-white focus:ring-4 focus:ring-clay/10";

/**
 * No server needed: the form composes a tidy message and opens WhatsApp with it
 * pre-filled, so every enquiry lands directly in the business WhatsApp.
 */
export default function EnquiryForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (key: string) => String(data.get(key) ?? "").trim();

    const optional = (label: string, key: string) => (get(key) ? [`${label}: ${get(key)}`] : []);
    const message = [
      "Hi Alpha Art & Crafts, I'd like to enquire about a project.",
      "",
      `Name: ${get("name")}`,
      ...optional("City", "city"),
      `Interested in: ${get("interest")}`,
      ...optional("Approx. size", "size"),
      ...optional("Details", "message"),
    ].join("\n");

    window.open(whatsappLink(message), "_blank", "noopener");
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2 md:gap-5">
      <label className="grid gap-2 text-sm font-medium">
        Your name
        <input name="name" required autoComplete="name" className={fieldClass} placeholder="Full name" />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        City
        <input name="city" autoComplete="address-level2" className={fieldClass} placeholder="Where is the project?" />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Interested in
        <select name="interest" className={fieldClass} defaultValue={collections[0].title}>
          {collections.map((c) => (
            <option key={c.slug}>{c.title}</option>
          ))}
          <option>A design from the Design Library</option>
          <option>Something custom</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Approx. size <span className="sr-only">(optional)</span>
        <input name="size" className={fieldClass} placeholder="e.g. 4 ft × 6 ft" />
      </label>
      <label className="grid gap-2 text-sm font-medium sm:col-span-2">
        Tell us about your project
        <textarea
          name="message"
          rows={5}
          className={`${fieldClass} resize-y`}
          placeholder="The space, colours you like, a design code, timeline…"
        />
      </label>
      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center">
        <button type="submit" className="btn btn-primary w-full sm:w-auto">
          <WhatsAppIcon size={18} /> Send via WhatsApp
        </button>
        <p className="text-xs leading-relaxed text-umber" aria-live="polite">
          {sent
            ? "WhatsApp opened with your message — just press send. You can attach photos of your wall there too."
            : "Opens WhatsApp with your details filled in. You can attach photos there too."}
        </p>
      </div>
    </form>
  );
}
