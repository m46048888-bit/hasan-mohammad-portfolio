import { createClient } from "@/lib/supabase/server";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import type { SiteSettings } from "@/types/database";

export const revalidate = 0;

export default async function AboutPage() {
  const supabase = createClient();
  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  const site = settings as SiteSettings;

  return (
    <>
      <SiteHeader siteName={site.site_name} />
      <section className="px-10 pt-40 pb-24 max-w-3xl">
        <h1 className="serif text-5xl md:text-7xl mb-14">
          The person <em className="text-mossBright not-italic italic">behind</em> the camera
        </h1>
        {site.about_bio ? (
          <div className="text-stone leading-relaxed whitespace-pre-line text-lg">{site.about_bio}</div>
        ) : (
          <p className="text-stone">Add a biography from /admin/settings — it will appear here.</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 border-t border-white/10 pt-10">
          <Stat value={site.stat_projects} label="Projects Completed" />
          <Stat value={site.stat_clients} label="Happy Clients" />
          <Stat value={site.stat_years} label="Years Experience" />
          <Stat value={site.stat_videos} label="Videos Edited" />
        </div>
      </section>
      <SiteFooter settings={site} />
    </>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="serif text-4xl text-mossBright">{value}+</div>
      <div className="mono text-[10px] text-stone uppercase mt-1">{label}</div>
    </div>
  );
}
