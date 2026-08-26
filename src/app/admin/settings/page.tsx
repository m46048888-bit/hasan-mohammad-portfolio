import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { SiteSettings } from "@/types/database";

async function saveSettings(formData: FormData) {
  "use server";
  const supabase = createClient();

  const payload = Object.fromEntries(
    [
      "site_name",
      "hero_title",
      "hero_subtitle",
      "hero_description",
      "hero_media_url",
      "hero_media_type",
      "about_bio",
      "contact_email",
      "contact_phone",
      "whatsapp_number",
      "instagram_url",
      "tiktok_url",
      "youtube_url",
      "facebook_url",
      "address",
      "copyright_text",
      "seo_title",
      "seo_description",
    ].map((key) => [key, String(formData.get(key) || "") || null])
  );

  const numeric = {
    stat_projects: Number(formData.get("stat_projects") || 0),
    stat_clients: Number(formData.get("stat_clients") || 0),
    stat_years: Number(formData.get("stat_years") || 0),
    stat_videos: Number(formData.get("stat_videos") || 0),
  };

  await supabase.from("site_settings").update({ ...payload, ...numeric }).eq("id", 1);

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/admin/settings");
}

export default async function AdminSettingsPage() {
  const supabase = createClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  const s = data as SiteSettings;

  return (
    <form action={saveSettings} className="max-w-2xl flex flex-col gap-8 pb-20">
      <h1 className="serif text-3xl">Site Settings</h1>

      <Section title="Hero">
        <Field label="Site Name"><input name="site_name" defaultValue={s.site_name} className="input" /></Field>
        <Field label="Hero Title"><input name="hero_title" defaultValue={s.hero_title} className="input" /></Field>
        <Field label="Hero Subtitle"><input name="hero_subtitle" defaultValue={s.hero_subtitle} className="input" /></Field>
        <Field label="Hero Description"><textarea name="hero_description" defaultValue={s.hero_description} rows={3} className="input" /></Field>
        <Field label="Hero Media URL"><input name="hero_media_url" defaultValue={s.hero_media_url ?? ""} placeholder="https://…" className="input" /></Field>
        <Field label="Hero Media Type">
          <select name="hero_media_type" defaultValue={s.hero_media_type} className="input">
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </Field>
      </Section>

      <Section title="About">
        <Field label="Biography"><textarea name="about_bio" defaultValue={s.about_bio ?? ""} rows={6} className="input" /></Field>
        <div className="grid grid-cols-4 gap-3">
          <Field label="Projects"><input name="stat_projects" type="number" defaultValue={s.stat_projects} className="input" /></Field>
          <Field label="Clients"><input name="stat_clients" type="number" defaultValue={s.stat_clients} className="input" /></Field>
          <Field label="Years"><input name="stat_years" type="number" defaultValue={s.stat_years} className="input" /></Field>
          <Field label="Videos"><input name="stat_videos" type="number" defaultValue={s.stat_videos} className="input" /></Field>
        </div>
      </Section>

      <Section title="Contact & Social">
        <Field label="Email"><input name="contact_email" defaultValue={s.contact_email ?? ""} className="input" /></Field>
        <Field label="Phone"><input name="contact_phone" defaultValue={s.contact_phone ?? ""} className="input" /></Field>
        <Field label="WhatsApp Number (with country code)"><input name="whatsapp_number" defaultValue={s.whatsapp_number ?? ""} className="input" /></Field>
        <Field label="Instagram URL"><input name="instagram_url" defaultValue={s.instagram_url ?? ""} className="input" /></Field>
        <Field label="TikTok URL"><input name="tiktok_url" defaultValue={s.tiktok_url ?? ""} className="input" /></Field>
        <Field label="YouTube URL"><input name="youtube_url" defaultValue={s.youtube_url ?? ""} className="input" /></Field>
        <Field label="Facebook URL"><input name="facebook_url" defaultValue={s.facebook_url ?? ""} className="input" /></Field>
        <Field label="Address"><input name="address" defaultValue={s.address ?? ""} className="input" /></Field>
        <Field label="Copyright Text"><input name="copyright_text" defaultValue={s.copyright_text ?? ""} className="input" /></Field>
      </Section>

      <Section title="SEO">
        <Field label="SEO Title"><input name="seo_title" defaultValue={s.seo_title ?? ""} className="input" /></Field>
        <Field label="SEO Description"><textarea name="seo_description" defaultValue={s.seo_description ?? ""} rows={2} className="input" /></Field>
      </Section>

      <button type="submit" className="mono text-xs uppercase bg-paper text-ink rounded-full px-6 py-3.5 w-fit">
        Save Changes
      </button>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-white/10 pt-6 flex flex-col gap-4">
      <h2 className="mono text-xs uppercase text-gold">{title}</h2>
      {children}
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mono text-[10px] text-stone block mb-2 uppercase">{label}</label>
      {children}
    </div>
  );
}
