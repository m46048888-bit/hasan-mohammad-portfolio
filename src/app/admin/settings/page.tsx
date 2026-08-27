import { createClient } from "@/lib/supabase/server";
import SettingsForm from "@/components/admin/SettingsForm";
import type { SiteSettings } from "@/types/database";

export default async function AdminSettingsPage() {
  const supabase = createClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  return <SettingsForm settings={data as SiteSettings} />;
}