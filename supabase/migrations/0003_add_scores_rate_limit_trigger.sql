create or replace function public.enforce_score_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select count(*) from public.scores s
      where s.player_id = new.player_id
        and s.created_at > now() - interval '1 minute') >= 5 then
    raise exception 'rate_limit_exceeded' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

create trigger scores_rate_limit
  before insert on public.scores
  for each row
  when (new.player_id is not null)
  execute function public.enforce_score_rate_limit();

-- The function is SECURITY DEFINER but must only run as a trigger, not be
-- callable directly via PostgREST RPC (flagged by the Supabase security advisor).
revoke execute on function public.enforce_score_rate_limit() from anon, authenticated, public;
