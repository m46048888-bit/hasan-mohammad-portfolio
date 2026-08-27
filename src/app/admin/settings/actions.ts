"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveSettings(formData: FormData) {
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

  const { error } = await supabase.from("site_settings").update({ ...payload, ...numeric }).eq("id", 1);

  if (error) {
    throw new Error("فشل الحفظ: " + error.message);
  }

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/admin/settings");
}