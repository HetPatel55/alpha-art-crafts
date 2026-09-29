import { whatsappLink } from "@/data/site";
import { WhatsAppIcon } from "./Icons";

export default function WhatsAppFab() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener"
      aria-label="Chat with us on WhatsApp"
      className="group fixed right-6 bottom-6 z-40 hidden h-14 items-center gap-2 rounded-full bg-[#25D366] px-4 text-white shadow-lg shadow-black/20 transition hover:scale-105 lg:flex"
    >
      <WhatsAppIcon size={26} />
      <span className="max-w-0 overflow-hidden text-sm font-semibold whitespace-nowrap transition-[max-width] duration-500 group-hover:max-w-40">
        Chat with us
      </span>
    </a>
  );
}
