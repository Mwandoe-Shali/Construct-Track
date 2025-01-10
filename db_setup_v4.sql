-- Drop all existing policies first
drop policy if exists "Managers can manage sites" on sites;
drop policy if exists "Supervisors can view assigned sites" on sites;
drop policy if exists "Managers can manage site supervisors" on site_supervisors;
drop policy if exists "Supervisors can view their assignments" on site_supervisors;
drop policy if exists "Users can insert their own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;
drop policy if exists "Public profiles are viewable by everyone" on profiles;
drop policy if exists "Managers can manage all profiles" on profiles;
drop policy if exists "Users can view all profiles" on profiles;
drop policy if exists "Users can update their own profile" on profiles;
drop policy if exists "Enable admin functions for managers" on profiles;
drop policy if exists "Managers can manage profiles" on profiles;

-- Create sites table if it doesn't exist
create table if not exists public.sites (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on sites
alter table public.sites enable row level security;

-- Create site_supervisors table if it doesn't exist
create table if not exists public.site_supervisors (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references sites(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(site_id, user_id)
);

-- Enable RLS on site_supervisors
alter table public.site_supervisors enable row level security;

-- Site policies
create policy "Managers can manage sites"
  on sites
  for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'manager'
    )
  );

create policy "Supervisors can view assigned sites"
  on sites
  for select
  using (
    exists (
      select 1 from site_supervisors
      where site_supervisors.site_id = sites.id
      and site_supervisors.user_id = auth.uid()
    )
    or
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'manager'
    )
  );

-- Site supervisors policies
create policy "Managers can manage site supervisors"
  on site_supervisors
  for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'manager'
    )
  );

create policy "Supervisors can view their assignments"
  on site_supervisors
  for select
  using (
    user_id = auth.uid()
    or
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'manager'
    )
  );

-- Profiles policies
create policy "Managers can manage all profiles"
  on profiles
  for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'manager'
    )
  );

create policy "Users can view all profiles"
  on profiles
  for select
  using (auth.uid() is not null);

create policy "Users can update their own profile"
  on profiles
  for update
  using (auth.uid() = id);

-- Ensure the handle_new_user trigger is working
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'role',
      'supervisor'
    )
  );
  return new;
end;
$$;

-- Recreate the trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 