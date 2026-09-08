create policy "scores_select_public"
  on public.scores
  for select
  to anon, authenticated
  using (true);

create policy "scores_insert_own"
  on public.scores
  for insert
  to authenticated
  with check (player_id = (select auth.uid()));

revoke update, delete on public.scores from anon, authenticated;
