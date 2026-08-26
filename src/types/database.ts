export type SiteSettings = {
  id: 1;
  site_name: string;
  logo_url: string | null;
  favicon_url: string | null;
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  hero_media_url: string | null;
  hero_media_type: "image" | "video";
  about_bio: string | null;
  stat_projects: number;
  stat_clients: number;
  stat_years: number;
  stat_videos: number;
  contact_email: string | null;
  contact_phone: string | null;
  whatsapp_number: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  youtube_url: string | null;
  facebook_url: string | null;
  address: string | null;
  copyright_text: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_og_image_url: string | null;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  image_url: string | null;
  sort_order: number;
  is_visible: boolean;
};

export type ProjectCategory =
  | "photography"
  | "video"
  | "product"
  | "commercial"
  | "social"
  | "events"
  | "branding";

export type Project = {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  client: string | null;
  location: string | null;
  project_date: string | null;
  services_used: string[] | null;
  credits: string | null;
  tags: string[] | null;
  cover_image_url: string | null;
  description: string | null;
  is_featured: boolean;
  status: "draft" | "published";
  sort_order: number;
};

export type ProjectImage = {
  id: string;
  project_id: string;
  image_url: string;
  caption: string | null;
  alt_text: string | null;
  sort_order: number;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  project_type: string | null;
  budget: string | null;
  message: string;
  status: "new" | "read" | "archived";
  created_at: string;
};

export type SocialLink = {
  id: string;
  platform: string;
  url: string;
  sort_order: number;
  is_visible: boolean;
};
