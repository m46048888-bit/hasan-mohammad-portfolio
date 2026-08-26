-- ============================================================
-- HASAN MOHAMMAD PORTFOLIO — DATABASE SCHEMA
-- Run this once in the Supabase SQL editor (or via `supabase db push`).
-- ============================================================

-- ---------- OWNERS ----------
-- Supabase already has auth.users. We mark who is allowed into /admin
-- with a tiny allow-list table instead of trusting any signed-up user.
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

-- ---------- SITE SETTINGS (singleton) ----------
create table if not exists public.site_settings (
  id int primary key default 1,
  site_name text not null default 'Hasan Mohammad',
  logo_url text,
  favicon_url text,
  hero_title text not null default 'HASAN MOHAMMAD',
  hero_subtitle text not null default 'Photographer & Video Editor',
  hero_description text not null default 'Turning moments, products and ideas into visuals that demand attention.',
  hero_media_url text,
  hero_media_type text not null default 'image' check (hero_media_type in ('image','video')),
  about_bio text,
  stat_projects int not null default 0,
  stat_clients int not null default 0,
  stat_years int not null default 0,
  stat_videos int not null default 0,
  contact_email text,
  contact_phone text,
  whatsapp_number text,
  instagram_url text,
  tiktok_url text,
  youtube_url text,
  facebook_url text,
  address text,
  copyright_text text,
  seo_title text,
  seo_description text,
  seo_og_image_url text,
  updated_at timestamptz not null default now(),
  constraint singleton check (id = 1)
);
insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- ---------- HOMEPAGE SECTIONS (for the drag-and-drop builder) ----------
create table if not exists public.homepage_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null,          -- 'hero' | 'featured_work' | 'services' | 'about' | 'testimonials' | 'contact' | ...
  title text,
  is_visible boolean not null default true,
  sort_order int not null default 0,
  settings jsonb not null default '{}'::jsonb,  -- per-section overrides
  created_at timestamptz not null default now()
);

-- ---------- SERVICES ----------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  icon text,
  image_url text,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- PROJECTS (portfolio) ----------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null check (category in ('photography','video','product','commercial','social','events','branding')),
  client text,
  location text,
  project_date date,
  services_used text[],
  credits text,
  tags text[],
  cover_image_url text,
  description text,
  is_featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft','published')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  image_url text not null,
  caption text,
  alt_text text,
  sort_order int not null default 0
);

create table if not exists public.project_videos (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  video_type text not null check (video_type in ('upload','youtube','vimeo')),
  video_url text not null,
  thumbnail_url text,
  autoplay boolean not null default false,
  muted boolean not null default true,
  loop boolean not null default false,
  aspect_ratio text default '16:9',
  sort_order int not null default 0
);

-- ---------- CLIENTS & TESTIMONIALS ----------
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  sort_order int not null default 0
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_role text,
  quote text not null,
  avatar_url text,
  sort_order int not null default 0,
  is_visible boolean not null default true
);

-- ---------- SOCIAL LINKS ----------
create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,   -- 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'whatsapp' | 'linkedin' | 'email'
  url text not null,
  sort_order int not null default 0,
  is_visible boolean not null default true
);

-- ---------- MEDIA LIBRARY (metadata; files live in Supabase Storage) ----------
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_url text not null,
  file_type text not null check (file_type in ('image','video')),
  file_size_kb int,
  uploaded_at timestamptz not null default now()
);

-- ---------- CONTACT MESSAGES ----------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  project_type text,
  budget text,
  message text not null,
  status text not null default 'new' check (status in ('new','read','archived')),
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- Public (anon) visitors can only READ published content.
-- Only rows in admin_users can write anything.
-- ============================================================

alter table public.site_settings enable row level security;
alter table public.homepage_sections enable row level security;
alter table public.services enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.project_videos enable row level security;
alter table public.clients enable row level security;
alter table public.testimonials enable row level security;
alter table public.social_links enable row level security;
alter table public.media enable row level security;
alter table public.contact_messages enable row level security;
alter table public.admin_users enable row level security;

-- Helper: is the current user an admin?
create or replace function public.is_admin() returns boolean as $$
  select exists (select 1 from public.admin_users where id = auth.uid());
$$ language sql stable security definer;

-- Public read policies
create policy "public read site_settings" on public.site_settings for select using (true);
create policy "public read homepage_sections" on public.homepage_sections for select using (is_visible = true);
create policy "public read services" on public.services for select using (is_visible = true);
create policy "public read published projects" on public.projects for select using (status = 'published');
create policy "public read project_images" on public.project_images for select using (true);
create policy "public read project_videos" on public.project_videos for select using (true);
create policy "public read clients" on public.clients for select using (true);
create policy "public read testimonials" on public.testimonials for select using (is_visible = true);
create policy "public read social_links" on public.social_links for select using (is_visible = true);

-- Anyone can submit a contact message, nobody but admins can read them back
create policy "anyone can insert contact_messages" on public.contact_messages for insert with check (true);
create policy "admin read contact_messages" on public.contact_messages for select using (public.is_admin());
create policy "admin update contact_messages" on public.contact_messages for update using (public.is_admin());
create policy "admin delete contact_messages" on public.contact_messages for delete using (public.is_admin());

-- Admin full access on every content table
create policy "admin all site_settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all homepage_sections" on public.homepage_sections for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all services" on public.services for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all projects" on public.projects for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all project_images" on public.project_images for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all project_videos" on public.project_videos for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all clients" on public.clients for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all testimonials" on public.testimonials for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all social_links" on public.social_links for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all media" on public.media for all using (public.is_admin()) with check (public.is_admin());
create policy "admin read admin_users" on public.admin_users for select using (public.is_admin());

-- ============================================================
-- SEED DATA (matches the design-mock content, safe to delete/edit)
-- ============================================================
insert into public.services (title, description, sort_order) values
  ('Photography', 'Commercial photography, product photography and creative campaigns.', 1),
  ('Video Editing', 'Professional editing, transitions, storytelling and cinematic post-production.', 2),
  ('Color Grading', 'Professional cinematic color correction and grading.', 3),
  ('Social Media Content', 'Short-form videos, reels and visual content.', 4),
  ('Product Photography', 'Premium product visuals for brands and businesses.', 5)
on conflict do nothing;

insert into public.social_links (platform, url, sort_order) values
  ('whatsapp', 'https://wa.me/96181139157', 1),
  ('instagram', 'https://www.instagram.com/by_7asan', 2)
on conflict do nothing;

update public.site_settings set
  whatsapp_number = '+96181139157',
  instagram_url = 'https://www.instagram.com/by_7asan'
where id = 1;
