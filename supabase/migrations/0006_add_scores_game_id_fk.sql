alter table public.scores
  add constraint scores_game_id_fkey
  foreign key (game_id) references public.games(id)
  on update cascade on delete restrict
  not valid;

alter table public.scores
  validate constraint scores_game_id_fkey;
