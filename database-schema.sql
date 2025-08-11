-- =========================================================
-- Toko Terang — Supabase schema (FINAL, run-once, idempotent)
-- Urutan: extensions → types → tables → functions → indexes →
--         triggers → RLS enable → policies → storage buckets/policies
-- =========================================================

-- 0) Extensions
create extension if not exists pgcrypto;  -- gen_random_uuid()

-- 1) Enums (pakai DO biar idempotent)
do $$
begin
  if not exists (select 1 from pg_type where typname = 'menu_group') then
    create type menu_group as enum ('Signature','Espresso','Manual','NonCoffee');
  end if;
  if not exists (select 1 from pg_type where typname = 'roast_level') then
    create type roast_level as enum ('Light','Light-Medium','Medium','Medium-Dark');
  end if;
  if not exists (select 1 from pg_type where typname = 'event_status') then
    create type event_status as enum ('scheduled','cancelled','completed');
  end if;
end$$;

-- 2) TABLES (tabel dulu supaya fungsi yang referensi tabel tidak error)

-- 2a) Profiles (role admin/editor)
drop table if exists public.profiles cascade;
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'viewer' check (role in ('admin','editor','viewer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2b) Books
drop table if exists public.books cascade;
create table public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  category text not null,
  price numeric(12,2) not null default 0,
  cover_url text,
  description text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2c) Events
drop table if exists public.events cascade;
create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date timestamptz not null,
  location text not null,
  is_online boolean not null default false,
  rsvp_url text,
  cover_url text,
  description text,
  status event_status not null default 'scheduled',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2d) Menu items (coffee menu)
drop table if exists public.menu_items cascade;
create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  "group" menu_group not null,
  price numeric(10,2) not null,
  badge text,
  description text,
  is_available boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2e) Beans line-up
drop table if exists public.beans cascade;
create table public.beans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  origin text not null,
  process text,
  roast roast_level,
  notes text not null,
  photo_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3) FUNCTIONS (setelah tabel ada)

-- 3a) touch_updated_at (dipakai triggers)
drop function if exists public.touch_updated_at() cascade;
create function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end$$;

-- 3b) is_staff (butuh tabel profiles → taruh di sini)
drop function if exists public.is_staff() cascade;
create function public.is_staff()
returns boolean language sql stable as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin','editor')
  );
$$;

-- 4) INDEXES
create index if not exists books_category_idx        on public.books (category);
create index if not exists books_is_published_idx    on public.books (is_published);
create index if not exists events_date_idx           on public.events (date);
create index if not exists events_is_published_idx   on public.events (is_published);
create index if not exists menu_group_idx            on public.menu_items ("group");
create index if not exists menu_available_idx        on public.menu_items (is_available);
create index if not exists beans_active_idx          on public.beans (is_active);
create index if not exists beans_origin_idx          on public.beans (origin);

-- 5) TRIGGERS (fungsi sudah ada)
drop trigger if exists trg_books_touch      on public.books;
drop trigger if exists trg_events_touch     on public.events;
drop trigger if exists trg_menu_touch       on public.menu_items;
drop trigger if exists trg_beans_touch      on public.beans;
drop trigger if exists trg_profiles_touch   on public.profiles;

create trigger trg_books_touch
before update on public.books
for each row execute function public.touch_updated_at();

create trigger trg_events_touch
before update on public.events
for each row execute function public.touch_updated_at();

create trigger trg_menu_touch
before update on public.menu_items
for each row execute function public.touch_updated_at();

create trigger trg_beans_touch
before update on public.beans
for each row execute function public.touch_updated_at();

create trigger trg_profiles_touch
before update on public.profiles
for each row execute function public.touch_updated_at();

-- 6) ENABLE RLS
alter table public.profiles   enable row level security;
alter table public.books      enable row level security;
alter table public.events     enable row level security;
alter table public.menu_items enable row level security;
alter table public.beans      enable row level security;

-- 7) POLICIES (drop-then-create → idempotent)

-- profiles
drop policy if exists profiles_self_select  on public.profiles;
drop policy if exists profiles_admin_manage on public.profiles;

create policy profiles_self_select
on public.profiles for select
to authenticated
using (id = auth.uid());

create policy profiles_admin_manage
on public.profiles for all
to authenticated
using (public.is_staff())
with check (public.is_staff());

-- books
drop policy if exists books_public_read on public.books;
drop policy if exists books_staff_write on public.books;

create policy books_public_read
on public.books for select
to anon, authenticated
using (is_published = true);

create policy books_staff_write
on public.books for all
to authenticated
using (public.is_staff())
with check (public.is_staff());

-- events
drop policy if exists events_public_read on public.events;
drop policy if exists events_staff_write on public.events;

create policy events_public_read
on public.events for select
to anon, authenticated
using (is_published = true);

create policy events_staff_write
on public.events for all
to authenticated
using (public.is_staff())
with check (public.is_staff());

-- menu_items
drop policy if exists menu_public_read on public.menu_items;
drop policy if exists menu_staff_write on public.menu_items;

create policy menu_public_read
on public.menu_items for select
to anon, authenticated
using (is_available = true);

create policy menu_staff_write
on public.menu_items for all
to authenticated
using (public.is_staff())
with check (public.is_staff());

-- beans
drop policy if exists beans_public_read on public.beans;
drop policy if exists beans_staff_write on public.beans;

create policy beans_public_read
on public.beans for select
to anon, authenticated
using (is_active = true);

create policy beans_staff_write
on public.beans for all
to authenticated
using (public.is_staff())
with check (public.is_staff());

-- 8) STORAGE BUCKETS (idempotent upsert)
insert into storage.buckets (id, name, public)
values ('books','books',true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('events','events',true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('beans','beans',true)
on conflict (id) do nothing;

-- 9) STORAGE POLICIES (drop-then-create)
drop policy if exists storage_public_read_books    on storage.objects;
drop policy if exists storage_public_read_events   on storage.objects;
drop policy if exists storage_public_read_beans    on storage.objects;
drop policy if exists storage_staff_write_books    on storage.objects;
drop policy if exists storage_staff_update_books   on storage.objects;
drop policy if exists storage_staff_delete_books   on storage.objects;
drop policy if exists storage_staff_write_events   on storage.objects;
drop policy if exists storage_staff_update_events  on storage.objects;
drop policy if exists storage_staff_delete_events  on storage.objects;
drop policy if exists storage_staff_write_beans    on storage.objects;
drop policy if exists storage_staff_update_beans   on storage.objects;
drop policy if exists storage_staff_delete_beans   on storage.objects;

create policy storage_public_read_books
on storage.objects for select
to anon, authenticated
using (bucket_id = 'books');

create policy storage_public_read_events
on storage.objects for select
to anon, authenticated
using (bucket_id = 'events');

create policy storage_public_read_beans
on storage.objects for select
to anon, authenticated
using (bucket_id = 'beans');

create policy storage_staff_write_books
on storage.objects for insert to authenticated
with check (bucket_id = 'books' and public.is_staff());

create policy storage_staff_update_books
on storage.objects for update to authenticated
using (bucket_id = 'books' and public.is_staff())
with check (bucket_id = 'books' and public.is_staff());

create policy storage_staff_delete_books
on storage.objects for delete to authenticated
using (bucket_id = 'books' and public.is_staff());

create policy storage_staff_write_events
on storage.objects for insert to authenticated
with check (bucket_id = 'events' and public.is_staff());

create policy storage_staff_update_events
on storage.objects for update to authenticated
using (bucket_id = 'events' and public.is_staff())
with check (bucket_id = 'events' and public.is_staff());

create policy storage_staff_delete_events
on storage.objects for delete to authenticated
using (bucket_id = 'events' and public.is_staff());

create policy storage_staff_write_beans
on storage.objects for insert to authenticated
with check (bucket_id = 'beans' and public.is_staff());

create policy storage_staff_update_beans
on storage.objects for update to authenticated
using (bucket_id = 'beans' and public.is_staff())
with check (bucket_id = 'beans' and public.is_staff());

create policy storage_staff_delete_beans
on storage.objects for delete to authenticated
using (bucket_id = 'beans' and public.is_staff());