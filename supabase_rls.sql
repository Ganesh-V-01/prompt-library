-- Prompt Library launch migration
-- Run once in Supabase SQL Editor. Review the two bootstrap admin UUIDs first.

begin;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  role text not null default 'viewer' check (role in ('viewer', 'contributor', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.prompts add column if not exists title text;
alter table public.prompts add column if not exists prompt_type text not null default 'image';
alter table public.prompts add column if not exists style text;
alter table public.prompts add column if not exists creator_name text;
alter table public.prompts add column if not exists source_url text;
alter table public.prompts add column if not exists aspect_ratio text;
alter table public.prompts add column if not exists negative_prompt text;
alter table public.prompts add column if not exists notes text;
alter table public.prompts add column if not exists image_path text;
alter table public.prompts add column if not exists rights_confirmed_at timestamptz;
alter table public.prompts add column if not exists status text;
alter table public.prompts add column if not exists featured boolean not null default false;
alter table public.prompts add column if not exists rejection_reason text;
alter table public.prompts add column if not exists updated_at timestamptz not null default now();

alter table public.prompts drop constraint if exists prompts_prompt_type_check;
alter table public.prompts add constraint prompts_prompt_type_check
  check (prompt_type in ('image', 'video'));
alter table public.prompts drop constraint if exists prompts_status_check;
alter table public.prompts add constraint prompts_status_check
  check (status in ('draft', 'pending', 'published', 'rejected'));
alter table public.prompts drop constraint if exists prompts_source_url_check;
alter table public.prompts add constraint prompts_source_url_check
  check (source_url is null or source_url ~* '^https?://');

-- Preserve only content that existed before this migration as public content.
update public.prompts
set status = 'published',
    title = coalesce(nullif(trim(title), ''), 'Untitled Prompt')
where status is null;

-- Normalize legacy model labels so launch filters include existing content.
update public.prompts set model = 'Gemini / Nano Banana' where lower(model) like '%banana%';
update public.prompts set model = 'Midjourney' where lower(model) like 'midjourney%';
update public.prompts set model = 'ChatGPT / DALL-E' where lower(model) in ('chatgpt', 'dall-e', 'chatgpt / dall-e');
update public.prompts set model = 'Seedance' where lower(model) like 'seedance%';

alter table public.prompts alter column status set default 'pending';
alter table public.prompts alter column status set not null;

create index if not exists idx_prompts_status_created_at
  on public.prompts (status, created_at desc);
create index if not exists idx_prompts_model on public.prompts (model);
create index if not exists idx_prompts_style on public.prompts (style);
create index if not exists idx_prompts_user_status on public.prompts (user_id, status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists prompts_set_updated_at on public.prompts;
create trigger prompts_set_updated_at
before update on public.prompts
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

insert into public.profiles (id, email, display_name)
select id, email, coalesce(raw_user_meta_data ->> 'display_name', split_part(email, '@', 1))
from auth.users
on conflict (id) do update set email = excluded.email;

-- Bootstrap the two existing administrators.
update public.profiles
set role = 'admin'
where id in (
  '0fa18228-1941-4fbd-a35a-53106eec0137',
  'be3e4bfc-9008-4c03-a11b-8eef831df503'
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.is_contributor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('contributor', 'admin')
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.is_contributor() to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.prompts enable row level security;

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile"
on public.profiles for select to authenticated
using (id = auth.uid());

drop policy if exists "Admins manage profiles" on public.profiles;
create policy "Admins manage profiles"
on public.profiles for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public read" on public.prompts;
drop policy if exists "Public read published prompts" on public.prompts;
create policy "Public read published prompts"
on public.prompts for select to anon, authenticated
using (status = 'published');

drop policy if exists "Admin access" on public.prompts;
drop policy if exists "Admins manage prompts" on public.prompts;
create policy "Admins manage prompts"
on public.prompts for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Contributors read own submissions" on public.prompts;
create policy "Contributors read own submissions"
on public.prompts for select to authenticated
using (user_id = auth.uid());

drop policy if exists "Contributors create pending submissions" on public.prompts;
create policy "Contributors create pending submissions"
on public.prompts for insert to authenticated
with check (
  public.is_contributor()
  and user_id = auth.uid()
  and status = 'pending'
  and rights_confirmed_at is not null
);

drop policy if exists "Contributors update own unpublished submissions" on public.prompts;
create policy "Contributors update own unpublished submissions"
on public.prompts for update to authenticated
using (user_id = auth.uid() and status in ('pending', 'rejected'))
with check (user_id = auth.uid() and status = 'pending' and public.is_contributor());

drop policy if exists "Contributors delete own unpublished submissions" on public.prompts;
create policy "Contributors delete own unpublished submissions"
on public.prompts for delete to authenticated
using (user_id = auth.uid() and status in ('pending', 'rejected') and public.is_contributor());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'prompt-images',
  'prompt-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- Public bucket URLs serve published images without a broad SELECT policy.
-- Remove legacy policies that allow every client to list objects or upload.
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Public read images" on storage.objects;
drop policy if exists "Authenticated users can upload images" on storage.objects;

drop policy if exists "Admin images" on storage.objects;
drop policy if exists "Admins manage prompt images" on storage.objects;
create policy "Admins manage prompt images"
on storage.objects for all to authenticated
using (bucket_id = 'prompt-images' and public.is_admin())
with check (bucket_id = 'prompt-images' and public.is_admin());

drop policy if exists "Contributors upload own prompt images" on storage.objects;
create policy "Contributors upload own prompt images"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'prompt-images'
  and public.is_contributor()
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Contributors read own prompt images" on storage.objects;
create policy "Contributors read own prompt images"
on storage.objects for select to authenticated
using (
  bucket_id = 'prompt-images'
  and public.is_contributor()
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Contributors update own prompt images" on storage.objects;
create policy "Contributors update own prompt images"
on storage.objects for update to authenticated
using (
  bucket_id = 'prompt-images'
  and public.is_contributor()
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'prompt-images'
  and public.is_contributor()
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Contributors delete own prompt images" on storage.objects;
create policy "Contributors delete own prompt images"
on storage.objects for delete to authenticated
using (
  bucket_id = 'prompt-images'
  and public.is_contributor()
  and (storage.foldername(name))[1] = auth.uid()::text
);

commit;
