import { createClient } from "@/lib/supabase/server";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import type { Service, SiteSettings } from "@/types/database";

export const revalidate = 0;

export default async function ServicesPage() {
  const supabase = createClient();
  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  const { data: services } = await supabase.from("services").select("*").eq("is_visible", true).order("sort_order");

  return (
    <>
      <SiteHeader siteName={(settings as SiteSettings).site_name} />
      <section className="px-10 pt-40 pb-24">
        <h1 className="serif text-5xl md:text-7xl mb-16">
          Services &amp; <em className="text-mossBright not-italic italic">craft</em>
        </h1>
        <div className="border-t border-white/10">
          {(services as Service[] | null)?.map((s, i) => (
            <div key={s.id} className="flex gap-8 py-9 border-b border-white/10 items-center">
              <div className="mono text-stone w-12">{String(i + 1).padStart(2, "0")}</div>
              <div className="flex-1">
                <h3 className="serif text-2xl md:text-3xl mb-2">{s.title}</h3>
                <p className="text-stone text-sm max-w-md">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter settings={settings as SiteSettings} />
    </>
  );
}
