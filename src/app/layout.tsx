import type { Metadata } from "next";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("seo_title, seo_description, seo_og_image_url, favicon_url, site_name")
    .eq("id", 1)
    .single();

  return {
    title: settings?.seo_title || settings?.site_name || "Hasan Mohammad — Photographer & Video Editor",
    description:
      settings?.seo_description ||
      "Photography and video editing portfolio of Hasan Mohammad.",
    icons: settings?.favicon_url ? [{ url: settings.favicon_url }] : undefined,
    openGraph: settings?.seo_og_image_url
      ? { images: [settings.seo_og_image_url] }
      : undefined,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
