# Supabase setup

1. Create a Supabase project and copy its Project URL and publishable (anon) key.
2. Copy `.env.example` to `.env.local`, fill in those two public client values, and restart `npm run dev`.
3. In Supabase SQL Editor, run `supabase/migrations/202611050001_customer_invitations.sql`, then `supabase/migrations/202611050002_gujarati_publication.sql`.
4. Enable email OTP in Authentication → Providers → Email and configure the allowed redirect URLs for the local and deployed site origins.
5. Sign in at `/dashboard/`, create a Gujarati Heirloom draft, then edit it at `/dashboard/invitations/<id>/edit/`.
6. Set the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables in Vercel, and deploy the Vite project. The repository's `vercel.json` allows direct guest invitation links to open.
7. A guest URL is created only for a verified purchase. The purchase webhook must set `invitations.purchase_verified` with a server-only service credential after independently verifying payment. Never expose that credential in the browser. Payment verification is **not implemented** yet.

Only the Supabase URL and publishable/anon key belong in `.env.local`; never put a service-role key in `VITE_*` variables. Invitation drafts and their photos remain private. When a paid owner publishes, the app copies selected photos into a public guest bucket and stores a separate public snapshot. Guests can open `/gujarati/i/<slug>/` without signing in. A saved draft does not change the guest snapshot until the owner publishes again. Published photos remain publicly accessible by their direct file URLs; hiding a guest link alone does not remove those photos. Live sign-in, purchase verification, photo upload, and guest sharing require end-to-end checks after Supabase and deployment are configured.
