create type public.app_role as enum ('admin', 'user');
create type public.lead_status as enum ('new','in_progress','contacted','qualified','closed','spam');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create policy "Users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

-- Owner self-claim: only the site owner's confirmed email becomes admin
create or replace function public.claim_owner_admin()
returns boolean language plpgsql security definer set search_path = public
as $$
declare _email text; _confirmed boolean;
begin
  select email, email_confirmed_at is not null into _email, _confirmed from auth.users where id = auth.uid();
  if _email is null or lower(_email) <> 'dzmitry.softdev@gmail.com' or not _confirmed then
    return public.has_role(auth.uid(), 'admin');
  end if;
  insert into public.user_roles (user_id, role) values (auth.uid(), 'admin') on conflict do nothing;
  return true;
end $$;
revoke execute on function public.claim_owner_admin() from public, anon;
grant execute on function public.claim_owner_admin() to authenticated;

create table public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 255),
  phone text check (phone is null or char_length(phone) <= 40),
  company text check (company is null or char_length(company) <= 160),
  services text[] not null default '{}',
  project_description text not null check (char_length(project_description) between 1 and 5000),
  project_stage text,
  budget text,
  timeline text,
  work_preference text,
  locale text,
  status lead_status not null default 'new'
);
grant insert on public.contact_requests to anon, authenticated;
grant select, update, delete on public.contact_requests to authenticated;
grant all on public.contact_requests to service_role;
alter table public.contact_requests enable row level security;
create policy "Anyone can submit a request" on public.contact_requests for insert to anon, authenticated with check (status = 'new');
create policy "Admins read requests" on public.contact_requests for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "Admins update requests" on public.contact_requests for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "Admins delete requests" on public.contact_requests for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;
create trigger contact_requests_touch before update on public.contact_requests for each row execute function public.touch_updated_at();

create table public.contact_request_notes (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.contact_requests(id) on delete cascade,
  author_id uuid not null default auth.uid(),
  body text not null check (char_length(body) between 1 and 5000),
  created_at timestamptz not null default now()
);
grant select, insert, delete on public.contact_request_notes to authenticated;
grant all on public.contact_request_notes to service_role;
alter table public.contact_request_notes enable row level security;
create policy "Admins manage notes" on public.contact_request_notes for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create index on public.contact_request_notes(request_id);
create index on public.contact_requests(created_at desc);