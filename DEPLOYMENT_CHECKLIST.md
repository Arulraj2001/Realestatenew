# Production Deployment Checklist: Your Choice Properties

Verify each item prior to promoting preview deployments to production on Vercel.

## 🗄️ Database & Security Setup
- [x] Version-controlled schema migrations applied in Supabase (`supabase/migrations/20260715000000_initial_schema.sql`).
- [x] Initial seed dataset executed (`supabase/seed.sql`).
- [x] Row Level Security (RLS) policies verified on all 12 PostgreSQL tables.
- [x] Security Definer functions `is_active_admin()` and `is_super_admin()` compiled.
- [x] Storage buckets `public-media` and `private-documents` initialized with storage RLS policies.
- [x] First admin user created and linked to `admin_profiles` table (`is_active = true`).

## ⚙️ Environment Variables Configured (Vercel)
- [x] `NEXT_PUBLIC_SITE_URL` set to production domain (`https://yourchoiceproperties.in`).
- [x] `NEXT_PUBLIC_SUPABASE_URL` attached to production Supabase instance.
- [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configured in Vercel project settings.
- [x] `SUPABASE_SERVICE_ROLE_KEY` added to Production environment (Server-Side Only).
- [x] `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY` added.
- [x] `MESSAGE_RATE_LIMIT_SECRET` added.

## 🔐 Supabase Auth Redirect URLs
- [x] Site URL set to `https://yourchoiceproperties.in`.
- [x] Redirect URLs added:
  - `https://yourchoiceproperties.in/admin/reset-password`
  - `https://*.vercel.app/admin/reset-password`
  - `http://localhost:3000/admin/reset-password`

## 🌐 SEO & Meta Validation
- [x] Dynamic sitemap generated at `/sitemap.xml`.
- [x] Crawl rules defined in `/robots.txt` disallowing `/admin/` and `/api/`.
- [x] Schema.org `LocalBusiness`, `Organization`, and `BreadcrumbList` JSON-LD validated.
- [x] OpenGraph meta titles and social share banners active across public routes.

## 🧪 Functional & Security Audit
- [x] Contact enquiry form submission & honeypot validation verified.
- [x] Chauffeured site visit appointment booking flow tested.
- [x] Click-to-call links (`tel:`) verified across mobile breakpoints.
- [x] WhatsApp click-to-chat links (`wa.me`) verified across mobile and desktop.
- [x] Admin login & server-side middleware authorization tested (`/admin/login`).
- [x] Admin content CRUD (Locations, Projects, Properties, Amenities, Landmarks, Gallery, Pages, SEO) operational.
- [x] Admin sales lead management & status transition pipeline tested.
- [x] `npm run lint` passes with 0 errors.
- [x] `npm run typecheck` passes with 0 errors.
- [x] `npm run test` passes with 7/7 unit tests passing.
- [x] `npm run build` compiles clean production bundle.
