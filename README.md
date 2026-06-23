# Hawk Motors — Premium Car Sales Platform

A premium, glassmorphism car-sales website with a secure custom CMS admin panel.
Built with **Next.js 14 (App Router)**, **React**, **Tailwind CSS**, **Framer Motion**,
**Prisma** and **PostgreSQL**.

The brand logo (silver eagle + diamond + wordmark) is recreated as a scalable SVG
(`components/Logo.tsx`) and the WhatsApp/contact number **07514552586** is baked in
(and editable from the admin Settings page).

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
#   → set DATABASE_URL to your Postgres connection string
#   → set NEXTAUTH_SECRET (openssl rand -base64 32)
#   → set ADMIN_EMAIL / ADMIN_PASSWORD for the seeded admin user

# 3. Create the schema and seed sample data
npm run db:push        # or: npm run db:migrate
npm run db:seed

# 4. Run it
npm run dev            # http://localhost:3000
```

Admin panel: **http://localhost:3000/admin** (sign in with the seeded `ADMIN_EMAIL` / `ADMIN_PASSWORD`).

> **No local Postgres?** Spin one up instantly with Docker:
> `docker run --name hawk-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=hawkmotors -p 5432:5432 -d postgres:16`
> Hosted options that work out of the box: **Neon**, **Supabase**, **Railway**, **RDS**.

---

## What's included

### Public site
- **Homepage** — full-width featured-vehicle hero slider, quick search, featured grid, "Why choose us", contact section with map, live stock counter.
- **Inventory** — advanced filtering (make, model, price min/max, year range, max mileage, fuel, transmission, body style, colour, max owners, keyword) + sorting (price, year, mileage).
- **Vehicle detail** — media gallery (unlimited images, full-screen lightbox, YouTube/Vimeo/walkaround video embeds), full specs, features, history/MOT/warranty, sticky enquiry rail (Call / WhatsApp / Email + form), similar vehicles, social sharing, schema.org `Car` markup.
- **My garage** (`/saved`) — saved vehicles + recently viewed (device-local).
- **Dark/light mode**, glassmorphism throughout, Framer Motion animations, mobile-first.
- **WhatsApp** floating button + click-to-call everywhere.

### Admin CMS (`/admin`)
- **Dashboard** — totals (vehicles, available, featured, enquiries), recent enquiries, most-viewed.
- **Vehicles** — add / edit / delete / duplicate, mark sold/reserved, feature toggle, inline status change, media manager (URL add, file upload, video embeds, reorder, cover image).
- **Enquiries** — filter by status, mark contacted/completed, archive, delete.
- **Categories** — manage makes, models, fuel types, body styles, colours.
- **Settings** — configurable **accent colour** (silver default) + contact details, opening hours, map embed.
- **Secure login** via NextAuth (credentials, bcrypt-hashed), route-protected by middleware.

### SEO & performance
- SEO-friendly slugs, per-vehicle meta titles/descriptions, Open Graph, JSON-LD vehicle schema.
- Dynamic `sitemap.xml` and `robots.txt`.
- `next/image` optimisation + lazy loading; ready for a CDN.

---

## Architecture notes

| Area | Choice |
|------|--------|
| Routing | App Router. Public pages under `app/(public)`, admin under `app/admin`, APIs under `app/api`. |
| Data | Prisma models in `prisma/schema.prisma`; query helpers in `lib/vehicles.ts`. |
| Auth | NextAuth credentials provider (`lib/auth.ts`), guard helper `lib/guard.ts`, `middleware.ts` protects `/admin`. |
| Theming | Accent colour is a CSS variable (`--accent`) set from DB settings in the root layout, so it's reconfigurable without a redeploy. |
| Contact helpers | Pure helpers/types in `lib/contact.ts` (client-safe); DB-backed `getSiteContact()` in `lib/site.ts`. |
| Media uploads | `app/api/upload` writes to `public/uploads` in dev. **Swap for S3 / Cloudflare R2 / Vercel Blob in production** (see below). |
| Email | Enquiry notifications via Nodemailer (`lib/mailer.ts`) — set SMTP_* env vars; fails silently if unset. |

### Going to production
1. **Storage** — replace the disk write in `app/api/upload/route.ts` with a presigned upload to S3 / R2 / Vercel Blob and store the returned CDN URL. `next.config.js` already allows remote image hosts.
2. **Email** — set `SMTP_*` and `ENQUIRY_NOTIFY_TO`.
3. **Secrets** — set a strong `NEXTAUTH_SECRET` and change the seeded admin password.
4. **SSL / backups** — handled by your host (Vercel + managed Postgres recommended). Enable daily DB backups with your provider.

### Designed for future expansion
The schema and routing leave room to add **finance calculator, finance applications, online checkout and reservations** later without redesign (e.g. add `FinanceQuote` / `Reservation` models and `app/api/*` routes; the `VehicleStatus` enum already includes `RESERVED`). These are intentionally **not** built yet, per spec.

---

## Default credentials
`admin@hawkmotors.co.uk` / `ChangeMe123!` (override via `.env`). **Change immediately in production.**

## Scripts
`dev`, `build`, `start`, `lint`, `db:push`, `db:migrate`, `db:seed`, `db:studio`.
