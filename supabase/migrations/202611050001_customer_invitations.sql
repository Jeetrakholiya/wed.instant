create extension if not exists pgcrypto;

create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  template_id text not null check (template_id = 'heirloom'),
  draft_data jsonb not null,
  status text not null default 'draft' check (status = 'draft'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists invitations_owner_updated on public.invitations(owner_id,updated_at desc);
alter table public.invitations enable row level security;
drop policy if exists "owners manage invitations" on public.invitations;
create policy "owners manage invitations" on public.invitations for all to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));
grant select,insert,update,delete on public.invitations to authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('customer-photos','customer-photos',false,12582912,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=false,file_size_limit=12582912,allowed_mime_types=array['image/jpeg','image/png','image/webp'];
drop policy if exists "customers manage own invitation photos" on storage.objects;
create policy "customers manage own invitation photos" on storage.objects for all to authenticated
  using(bucket_id='customer-photos' and (storage.foldername(name))[1]=(select auth.uid())::text)
  with check(bucket_id='customer-photos' and (storage.foldername(name))[1]=(select auth.uid())::text);
