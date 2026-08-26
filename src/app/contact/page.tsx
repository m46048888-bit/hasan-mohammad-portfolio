import { createClient } from "@/lib/supabase/server";
import SiteHeader from "@/components/SiteHeader";
import type { SiteSettings } from "@/types/database";
import ContactForm from "./ContactForm";

export const revalidate = 0;

export default async function ContactPage() {
  const supabase = createClient();
  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  const site = settings as SiteSettings;

  const waNumber = site.whatsapp_number?.replace(/[^0-9]/g, "");

  return (
    <>
      <SiteHeader siteName={site.site_name} />
      <section className="px-10 pt-40 pb-24 bg-paper text-ink min-h-screen">
        <h1 className="serif text-5xl md:text-8xl mb-14 leading-none">
          Let&apos;s make <em className="text-moss not-italic italic">something</em>
          <br />worth watching.
        </h1>

        <div className="grid md:grid-cols-2 gap-14">
          <div className="flex flex-col gap-3.5 max-w-sm">
            {waNumber && (
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noopener"
                className="flex items-center justify-between gap-4 px-6 py-5 rounded-2xl border border-black/10 hover:border-moss hover:translate-x-1.5 transition-all"
              >
                <div>
                  <div className="serif text-lg">WhatsApp</div>
                  <div className="mono text-[11px] text-stone">{site.whatsapp_number}</div>
                </div>
                <span className="mono">→</span>
              </a>
            )}
            {site.instagram_url && (
              <a
                href={site.instagram_url}
                target="_blank"
                rel="noopener"
                className="flex items-center justify-between gap-4 px-6 py-5 rounded-2xl border border-black/10 hover:border-moss hover:translate-x-1.5 transition-all"
              >
                <div>
                  <div className="serif text-lg">Instagram</div>
                  <div className="mono text-[11px] text-stone">Message directly</div>
                </div>
                <span className="mono">→</span>
              </a>
            )}
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
