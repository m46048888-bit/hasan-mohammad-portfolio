import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import type { Project, ProjectImage, SiteSettings } from "@/types/database";

export const revalidate = 0;

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).single();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (!project) notFound();

  const { data: images } = await supabase
    .from("project_images")
    .select("*")
    .eq("project_id", (project as Project).id)
    .order("sort_order");

  const p = project as Project;

  return (
    <>
      <SiteHeader siteName={(settings as SiteSettings).site_name} />
      <article className="px-10 pt-40 pb-24 max-w-5xl mx-auto">
        <div className="mono text-xs text-gold uppercase mb-4">{p.category}</div>
        <h1 className="serif text-4xl md:text-6xl mb-10">{p.title}</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14 text-sm border-t border-b border-white/10 py-6">
          {p.client && (
            <div>
              <div className="mono text-[10px] text-stone mb-1">Client</div>
              <div>{p.client}</div>
            </div>
          )}
          {p.location && (
            <div>
              <div className="mono text-[10px] text-stone mb-1">Location</div>
              <div>{p.location}</div>
            </div>
          )}
          {p.services_used && p.services_used.length > 0 && (
            <div>
              <div className="mono text-[10px] text-stone mb-1">Services</div>
              <div>{p.services_used.join(" / ")}</div>
            </div>
          )}
          {p.project_date && (
            <div>
              <div className="mono text-[10px] text-stone mb-1">Date</div>
              <div>{new Date(p.project_date).toLocaleDateString()}</div>
            </div>
          )}
        </div>

        {p.cover_image_url && (
          <div className="relative w-full mb-10 overflow-hidden rounded-sm">
            <img src={p.cover_image_url} alt={p.title} className="w-full h-auto" />
          </div>
        )}

        {p.description && <p className="text-stone leading-relaxed max-w-2xl mb-14">{p.description}</p>}

        {images && images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(images as ProjectImage[]).map((img) => (
              <div key={img.id} className="relative w-full overflow-hidden rounded-sm">
                <img src={img.image_url} alt={img.alt_text || p.title} className="w-full h-auto" />
              </div>
            ))}
          </div>
        )}

        {p.credits && <p className="mono text-[11px] text-stone mt-14">{p.credits}</p>}
      </article>
      <SiteFooter settings={settings as SiteSettings} />
    </>
  );
}