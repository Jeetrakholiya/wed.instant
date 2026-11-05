# Supabase setup

1. Create a Supabase project and copy its Project URL and publishable (anon) key.
2. Copy `.env.example` to `.env.local`, fill in those two public client values, and restart `npm run dev`.
3. In Supabase SQL Editor, run `supabase/migrations/202611050001_customer_invitations.sql`.
4. Enable email OTP in Authentication → Providers → Email and configure the allowed redirect URLs for the local and deployed site origins.
5. Sign in at `/dashboard/`, create a Heirloom draft, then edit it at `/dashboard/invitations/<id>/edit/`.

Only the Supabase URL and publishable/anon key belong in `.env.local`; never put a service-role key in `VITE_*` variables. Invitation rows use RLS and photo objects are private and scoped to the authenticated user's UUID folder. Live sign-in/storage cannot be verified until a real Supabase project is configured.
