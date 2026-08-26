import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import type { Project, Service, SiteSettings } from "@/types/database";

export const revalidate = 0; // always fetch fresh content edited from the admin

export default async function HomePage() {
  const supabase = createClient();

  const [{ data: settings }, { data: featured }, { data: services }] = await Promise.all([
    supabase.from("site_settings").select("*").eq("id", 1).single(),
    supabase
      .from("projects")
      .select("*")
      .eq("status", "published")
      .eq("is_featured", true)
      .order("sort_order")
      .limit(6),
    supabase.from("services").select("*").eq("is_visible", true).order("sort_order"),
  ]);

  const site = settings as SiteSettings;

  return (
    <>
      <SiteHeader siteName={site.site_name} />

      {/* HERO — every word below comes from site_settings, editable in /admin/settings */}
      <section className="min-h-[100dvh] relative flex flex-col justify-end px-10 pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {site.hero_media_url && site.hero_media_type === "image" && (
            <Image
              src={site.hero_media_url}
              alt=""
              fill
              className="object-cover opacity-30 grayscale"
              priority
            />
          )}
          {site.hero_media_url && site.hero_media_type === "video" && (
            <video
              src={site.hero_media_url}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
          )}
        </div>

        <h1 className="serif font-medium leading-[0.92] text-[clamp(50px,10vw,150px)]">
          {site.hero_title}
        </h1>

        <div className="flex flex-wrap justify-between items-end gap-10 mt-8">
          <div>
            <div className="mono text-sm text-stone mb-3">{site.hero_subtitle}</div>
            <p className="max-w-sm text-stone text-[15px] leading-relaxed">{site.hero_description}</p>
            <div className="flex gap-3 mt-6">
              <Link href="/work" className="mono text-xs uppercase bg-paper text-ink rounded-full px-6 py-3.5 hover:bg-gold transition-colors">
                View My Work
              </Link>
              <Link href="/contact" className="mono text-xs uppercase border border-white/15 rounded-full px-6 py-3.5 hover:border-paper transition-colors">
                Let&apos;s Work Together
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED WORK */}
      {featured && featured.length > 0 && (
        <section className="px-10 py-32">
          <div className="flex justify-between items-end mb-16 flex-wrap gap-8">
            <h2 className="serif text-4xl md:text-5xl max-w-xl">
              Selected <em className="text-mossBright not-italic italic">work</em>
            </h2>
            <Link href="/work" className="mono text-xs text-stone hover:text-paper">
              View all work →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(featured as Project[]).map((p) => (
              <Link
                key={p.id}
                href={`/work/${p.slug}`}
                className="relative aspect-[4/5] overflow-hidden rounded-sm group block"
              >
                {p.cover_image_url && (
                  <Image
                    src={p.cover_image_url}
                    alt={p.title}
                    fill
                    className="object-cover grayscale-[0.4] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 to-transparent flex flex-col justify-end p-5">
                  <div className="mono text-[10px] text-gold mb-1 uppercase">{p.category}</div>
                  <div className="serif text-xl">{p.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* SERVICES SUMMARY */}
      {services && services.length > 0 && (
        <section className="px-10 py-32 border-t border-white/10">
          <h2 className="serif text-4xl md:text-5xl mb-14 max-w-xl">
            What happens <em className="text-mossBright not-italic italic">behind</em> the lens
          </h2>
          <div className="border-t border-white/10">
            {(services as Service[]).map((s, i) => (
              <div key={s.id} className="flex gap-8 py-8 border-b border-white/10 items-center">
                <div className="mono text-stone w-12">{String(i + 1).padStart(2, "0")}</div>
                <div className="flex-1">
                  <h3 className="serif text-2xl mb-1">{s.title}</h3>
                  <p className="text-stone text-sm max-w-md">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <SiteFooter settings={site} />
    </>
  );
}
