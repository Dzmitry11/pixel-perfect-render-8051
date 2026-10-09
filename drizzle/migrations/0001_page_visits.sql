create table public.page_visits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  visitor_id text not null,
  path text not null,
  country text,
  city text,
  referrer text
);
grant select, delete on public.page_visits to authenticated;
grant all on public.page_visits to service_role;
alter table public.page_visits enable row level security;
create policy "Admins read visits" on public.page_visits for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "Admins delete visits" on public.page_visits for delete to authenticated using (public.has_role(auth.uid(),'admin'));
create index page_visits_created_idx on public.page_visits(created_at desc);