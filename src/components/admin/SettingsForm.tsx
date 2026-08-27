"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { saveSettings } from "@/app/admin/settings/actions";
import type { SiteSettings } from "@/types/database";

export default function SettingsForm({ settings }: { settings: SiteSettings }) {
  const s = settings;
  const [mediaUrl, setMediaUrl] = useState(s.hero_media_url ?? "");
  const [mediaType, setMediaType] = useState(s.hero_media_type || "image");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = Date.now() + "-" + Math.random().toString(36).slice(2) + "." + fileExt;

    const { error: uploadError } = await supabase.storage.from("project-images").upload(fileName, file);

    if (uploadError) {
      setError("فشل رفع الملف: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("project-images").getPublicUrl(fileName);
    setMediaUrl(data.publicUrl);
    setMediaType(file.type.startsWith("video") ? "video" : "image");
    setUploading(false);
  }

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setError("");
    try {
      await saveSettings(formData);
      alert("تم الحفظ بنجاح");
    } catch (err: any) {
      setError(err.message || "حدث خطأ غير متوقع");
    }
    setSaving(false);
  }

  return (
    <form action={handleSubmit} className="max-w-2xl flex flex-col gap-8 pb-20">
      <h1 className="serif text-3xl">Site Settings</h1>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <Section title="Hero">
        <Field label="Site Name"><input name="site_name" defaultValue={s.site_name} className="input" /></Field>
        <Field label="Hero Title"><input name="hero_title" defaultValue={s.hero_title} className="input" /></Field>
        <Field label="Hero Subtitle"><input name="hero_subtitle" defaultValue={s.hero_subtitle} className="input" /></Field>
        <Field label="Hero Description"><textarea name="hero_description" defaultValue={s.hero_description} rows={3} className="input" /></Field>

        <Field label="Hero Media (Image or Video)">
          <input type="file" accept="image/,video/" onChange={handleFileChange} className="input" />
          {uploading && <p className="text-stone text-xs mt-2">جاري الرفع...</p>}
          {mediaUrl && !uploading && (
            mediaType === "video" ? (
              <video src={mediaUrl} className="mt-3 rounded-sm max-h-48" controls />
            ) : (
              <img src={mediaUrl} alt="Preview" className="mt-3 rounded-sm max-h-48 object-cover" />
            )
          )}
          <input type="hidden" name="hero_media_url" value={mediaUrl} />
          <input type="hidden" name="hero_media_type" value={mediaType} />
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

      <button type="submit" disabled={saving || uploading} className="mono text-xs uppercase bg-paper text-ink rounded-full px-6 py-3.5 w-fit disabled:opacity-50">
        {saving ? "جاري الحفظ..." : "Save Changes"}
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