import Link from "next/link";
import type { SiteSettings } from "@/types/database";

export default function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="bg-paper text-ink px-10 pt-10 pb-8 border-t border-black/10">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div className="serif text-xl">{settings.site_name}</div>
        <div className="flex gap-6 mono text-xs text-stone">
          <Link href="/work">Work</Link>
          <Link href="/services">Services</Link>
          <Link href="/about">About</Link>
          {settings.whatsapp_number && (
            <a href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener">
              WhatsApp
            </a>
          )}
          {settings.instagram_url && (
            <a href={settings.instagram_url} target="_blank" rel="noopener">
              Instagram
            </a>
          )}
        </div>
      </div>
      <div className="mono text-[10px] text-stone mt-5">
        {settings.copyright_text || `© ${new Date().getFullYear()} ${settings.site_name}. All frames reserved.`}
      </div>
    </footer>
  );
}
