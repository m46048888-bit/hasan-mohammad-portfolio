import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import type { Project, SiteSettings } from "@/types/database";

export const revalidate = 0;

export default async function WorkPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const supabase = createClient();
  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).single();

  let query = supabase.from("projects").select("*").eq("status", "published").order("sort_order");
  if (searchParams.category && searchParams.category !== "all") {
    query = query.eq("category", searchParams.category);
  }
  const { data: projects } = await query;

  const categories = ["all", "photography", "video", "product", "commercial", "social", "events", "branding"];
  const active = searchParams.category || "all";

  return (
    <>
      <SiteHeader siteName={(settings as SiteSettings).site_name} />
      <section className="px-10 pt-40 pb-24">
        <h1 className="serif text-5xl md:text-7xl mb-14">
          Selected <em className="text-mossBright not-italic italic">work</em>
        </h1>

        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((c) => (
            <Link
              key={c}
              href={c === "all" ? "/work" : `/work?category=${c}`}
              className={`mono text-[11px] uppercase px-4 py-2 rounded-full border ${
                active === c ? "border-gold text-gold" : "border-white/15 text-stone"
              }`}
            >
              {c}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(projects as Project[] | null)?.map((p) => (
            <Link key={p.id} href={`/work/${p.slug}`} className="relative aspect-[4/5] overflow-hidden rounded-sm group block">
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
          {(!projects || projects.length === 0) && (
            <p className="text-stone col-span-full">No published projects in this category yet.</p>
          )}
        </div>
      </section>
      <SiteFooter settings={settings as SiteSettings} />
    </>
  );
}
