# Hasan Mohammad — Portfolio & Admin CMS

A real, runnable Next.js project: public portfolio site + a protected owner
dashboard backed by Supabase (Postgres + Auth + Storage). Every editable
piece of content (hero text, bio, services, projects, contact info, social
links) lives in the database, not in the source code.

This project was written in a sandbox with no internet access, so it has
**not** been run or tested end-to-end. Follow the steps below on your own
machine — they're standard for any Next.js + Supabase app.

---

## 1. What you need first

- Node.js 18+ installed
- A free [Supabase](https://supabase.com) account
- (Optional, for deployment) a [Vercel](https://vercel.com) account

## 2. Create the Supabase project

1. Create a new project at supabase.com.
2. Go to **SQL Editor** → paste the entire contents of `supabase/schema.sql`
   → Run. This creates every table, security rule, and seeds your services
   and social links (WhatsApp + Instagram are already filled in).
3. Go to **Project Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret,
     never commit it or send it to the browser)

## 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in the three Supabase values from step 2.

## 4. Install and run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the public site.

## 5. Create your first owner (admin) account

Supabase Auth and the `admin_users` allow-list are separate on purpose — a
signed-up user is not an admin until you say so.

1. In the Supabase dashboard, go to **Authentication → Users → Add user**,
   create yourself with an email + password.
2. Copy the new user's UUID from that same screen.
3. Back in **SQL Editor**, run:
   ```sql
   insert into public.admin_users (id, full_name)
   values ('paste-the-uuid-here', 'Hasan Mohammad');
   ```
4. Go to `http://localhost:3000/admin/login` and sign in with that email +
   password.

You now have full access to the dashboard: Projects, Services, Messages,
Settings.

## 6. Add real content

- **Settings** — hero title/subtitle/description, bio, stats, contact info,
  social links, SEO. This replaces every placeholder immediately on save.
- **Projects** — add a title, category, cover image URL, description,
  mark "Feature on homepage", set status to Published.
- **Images** — for now, paste a public image URL (e.g. from Supabase
  Storage, once you upload files there manually via the Storage tab, or
  any other host). A proper in-dashboard upload widget is the natural next
  addition — see "What's next" below.

## 7. Deploy

The simplest path is Vercel:

1. Push this project to a GitHub repo.
2. Import it in Vercel.
3. Add the same three environment variables from `.env.local` in the
   Vercel project settings.
4. Deploy. Your live URL will serve the same site, reading from the same
   Supabase project.

## What's included

- Public pages: Home, Work (with category filter), Project detail, Services,
  About, Contact (with a real database-backed contact form)
- WhatsApp and Instagram buttons wired to the numbers/links stored in
  Settings, not hardcoded
- Admin dashboard: login (Supabase Auth), Projects CRUD, Services CRUD,
  Messages inbox, Settings form for hero/about/contact/social/SEO
- Row Level Security so visitors can only ever read published content, and
  only accounts listed in `admin_users` can write anything

## What's next (not built yet, by design — to keep this a working core rather than an untested mega-app)

- **Media Library UI** — an in-dashboard upload button that pushes files to
  Supabase Storage and returns a URL, instead of pasting URLs by hand. The
  `media` table and Storage are already in the schema; this is a UI layer
  on top.
- **Drag-and-drop section/image reordering** — `sort_order` columns exist
  on every relevant table; today you edit the number in a field, a
  drag-and-drop UI is a good v2.
- **Visual Design Customizer** — colors/fonts are centralized in
  `tailwind.config.ts` and `globals.css`; wiring those to database-driven
  values is straightforward to add later.
- **Draft/Preview mode** — `status: draft/published` exists on projects;
  a "preview as visitor" toggle is a reasonable next step.
- **Testimonials & Clients pages** — tables exist in the schema
  (`testimonials`, `clients`) but no public page or admin UI yet.

## Project structure

```
src/
  app/
    page.tsx                 → homepage (reads site_settings, projects, services)
    work/                     → portfolio listing + [slug] case study
    services/, about/, contact/
    admin/
      login/                  → Supabase Auth sign-in
      layout.tsx              → sidebar + admin_users gate
      page.tsx                → dashboard overview
      projects/               → list, new, [id] edit + actions.ts
      services/               → inline CRUD
      messages/               → contact inbox
      settings/               → the main CMS form
  components/                 → SiteHeader, SiteFooter, admin/ProjectForm
  lib/supabase/               → browser + server + service-role clients
  types/database.ts           → TypeScript types matching the schema
  middleware.ts                → protects every /admin/* route
supabase/schema.sql            → full DB schema, RLS policies, seed data
```
