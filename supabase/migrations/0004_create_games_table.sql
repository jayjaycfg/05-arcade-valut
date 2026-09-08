create table public.games (
  id          text        primary key check (id ~ '^[a-z0-9-]{2,40}$'),
  title       text        not null,
  short       text        not null,
  long        text        not null,
  cat         text        not null check (cat in ('ARCADE', 'PUZZLE', 'SHOOTER', 'VERSUS')),
  cover       text        not null check (cover ~ '^cover-[a-z0-9-]{2,30}$'),
  color       text        not null check (color in ('cyan', 'magenta', 'yellow', 'green')),
  best        integer     not null default 0 check (best >= 0 and best <= 100000000),
  plays       integer     not null default 0 check (plays >= 0),
  playable    boolean     not null default false,
  sort_order  integer     not null,
  created_at  timestamptz not null default now()
);

create unique index games_sort_order_idx
  on public.games (sort_order);

comment on table public.games is 'Persisted game catalog. Admin-managed: public read only, no app-level writes.';

alter table public.games enable row level security;

create policy "games_select_public"
  on public.games
  for select
  to anon, authenticated
  using (true);

revoke insert, update, delete on public.games from anon, authenticated;
