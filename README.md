# Your Choice Properties — Real Estate & Township Portal

Production-ready Next.js App Router application built for **Your Choice Properties**, specializing in DTCP/RERA approved residential plots, gated layouts, and custom villa builds across Namakkal and Paramathi Velur, Tamil Nadu.

---

## 🛠️ Tech Stack & Architecture

* **Framework**: Next.js 16 (App Router with Server Components by default)
* **Language**: TypeScript (Strict Mode)
* **Styling**: Tailwind CSS v4 & Lucide React Icons
* **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) & Supabase Auth
* **Storage**: Supabase Storage (`public-media` bucket)
* **State & Forms**: React Hook Form & Zod Validation
* **Deployment**: Vercel Serverless

---

## 🚀 Prerequisites

Before starting, ensure you have installed:
* Node.js v20.x or v22.x LTS
* `npm` v10.x+
* Git
* A Supabase cloud project ([https://supabase.com](https://supabase.com))
* A Vercel deployment account ([https://vercel.com](https://vercel.com))

---

## 💻 Local Installation & Setup

1. **Clone Repository & Install Dependencies**:
   ```bash
   git clone https://github.com/your-org/your-choice-properties.git
   cd your-choice-properties
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Populate `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Migrations & Initial Setup

### 1. Apply Schema Migrations
In the Supabase SQL Editor, run the complete migration script located at:
[supabase/migrations/20260715000000_initial_schema.sql](file:///d:/Real/supabase/migrations/20260715000000_initial_schema.sql)

This creates:
* 12 core PostgreSQL tables (`admin_profiles`, `locations`, `projects`, `property_configurations`, `amenities`, `project_amenities`, `landmarks`, `gallery_items`, `content_pages`, `seo_metadata`, `messages`, `site_settings`).
* Row Level Security (RLS) policies on all tables.
* Storage buckets `public-media` and `private-documents`.
* Security definer functions `is_active_admin()` and `is_super_admin()`.

### 2. Seed Initial Content & Layout Data
Run the seed script in the Supabase SQL Editor:
[supabase/seed.sql](file:///d:/Real/supabase/seed.sql)

Seeds initial data for:
* Locations: Namakkal & Paramathi Velur
* Townships: Rasi Garden, Kongu Nagar, Kongu Garden
* Amenities & Default Page Content

### 3. Create the First Admin Account
To create your initial Super Admin account:
1. Create a user in your Supabase Auth panel (Authentication -> Users -> Add User).
2. Note the generated User `UUID`.
3. Execute the SQL link query:
   ```sql
   INSERT INTO public.admin_profiles (id, full_name, role, is_active)
   VALUES (
     '<replace-with-auth-user-uuid>',
     'Super Admin User',
     'super_admin',
     true
   )
   ON CONFLICT (id) DO UPDATE SET is_active = true, role = 'super_admin';
   ```
4. Sign in at [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

---

## 🧪 Running Tests & Quality Verification

Run the quality gate test suites locally:

```bash
# 1. Run ESLint check
npm run lint

# 2. Run TypeScript strict typecheck
npm run typecheck

# 3. Run Unit Test Suite
npm run test

# 4. Compile Production Build
npm run build
```

---

## 🌐 Deploying to Vercel

### Step 1: Connect Repository to Vercel
1. Import your GitHub repository into Vercel.
2. Select Framework Preset: **Next.js**.
3. Leave Build Command as standard `next build`.

### Step 2: Configure Vercel Environment Variables
Add the following variables under Vercel Settings -> Environment Variables:

| Variable Name | Environment Scope | Secret Type |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production / Preview / Development | Public |
| `NEXT_PUBLIC_SUPABASE_URL` | Production / Preview / Development | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production / Preview / Development | Public |
| `SUPABASE_SERVICE_ROLE_KEY` | Production / Preview / Development | Server-Only Secret |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY` | Production / Preview | Public |
| `MESSAGE_RATE_LIMIT_SECRET` | Production / Preview | Server-Only Secret |

### Step 3: Configure Supabase Auth URL Settings
In Supabase Dashboard -> Authentication -> URL Configuration:
* **Site URL**: `https://yourchoiceproperties.in`
* **Redirect URLs**:
  * `https://yourchoiceproperties.in/admin/reset-password`
  * `https://*.vercel.app/admin/reset-password`
  * `http://localhost:3000/admin/reset-password`

---

## 🔒 Security & Lead Data Retention Policies

* **Row Level Security (RLS)**: Public read access is strictly restricted to published content. Private leads in `messages` are accessible exclusively by authorized `sales_admin` and `super_admin` profiles.
* **Lead Privacy**: Honeypot traps reject automated form bots silently without database clutter.
* **Data Retention**: Resolved leads (`completed` or `closed`) older than 365 days should be archived. Deletion of customer records is restricted to `super_admin` accounts.

---

## 💾 Database Backup & Restore Basics

### Exporting Backup:
```bash
pg_dump -h db.your-project-id.supabase.co -U postgres -d postgres > backup.sql
```

### Restoring Backup:
```bash
psql -h db.your-project-id.supabase.co -U postgres -d postgres < backup.sql
```

---

## ❓ Troubleshooting Common Deployment Errors

* **Error: `cookies()` inside `generateStaticParams`**:
  * Fixed: Public data helpers use `createPublicClient()` without cookie overhead for static SSG generation.
* **Error: 403 Unauthorized on `/admin`**:
  * Ensure your Auth User `UUID` has an active record in `admin_profiles` where `is_active = true`.
* **Error: Image load failures on production**:
  * Ensure the domain is listed under `remotePatterns` in `next.config.ts`.
