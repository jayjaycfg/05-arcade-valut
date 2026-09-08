create table public.scores (
  id          uuid primary key default gen_random_uuid(),
  game_id     text        not null check (game_id ~ '^[a-z0-9-]{2,40}$'),
  player_id   uuid        references auth.users(id) on delete set null,
  nickname    text        not null check (nickname ~ '^[A-Z0-9_]{1,10}$'),
  score       integer     not null check (score >= 0 and score <= 100000000),
  created_at  timestamptz not null default now()
);

create index scores_game_id_score_idx
  on public.scores (game_id, score desc, created_at asc);

comment on table public.scores is 'Per-game leaderboard entries. Append-only: no update/delete policy exists.';
