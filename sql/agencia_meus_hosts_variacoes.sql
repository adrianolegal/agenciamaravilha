-- Execute no SQL Editor do Supabase da Agência Maravilha.
-- Recrutadores recebem exclusivamente os relatórios de suas próprias grafias.
create or replace function public.agencia_meus_hosts_variacoes()
returns setof public.host_reports_simplificado
language sql
stable
security definer
set search_path = ''
as $$
 with usuario as (
   select lower(regexp_replace(translate(trim(u.nome_agente),
      'ÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇáàâãäéèêëíìîïóòôõöúùûüç',
      'AAAAAEEEEIIIIOOOOOUUUUCaaaaaeeeeiiiiooooouuuuc'),
      '[^a-zA-Z0-9]', '', 'g')) as chave
   from public.agencia_usuarios u
   where u.user_id = auth.uid() and u.ativo is true and u.perfil = 'recrutador'
   limit 1
 ), nomes as (
   select r.*, lower(regexp_replace(translate(trim(r.nome_agente),
      'ÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇáàâãäéèêëíìîïóòôõöúùûüç',
      'AAAAAEEEEIIIIOOOOOUUUUCaaaaaeeeeiiiiooooouuuuc'),
      '[^a-zA-Z0-9]', '', 'g')) as chave
   from public.host_reports_simplificado r
 )
 select n.member_id,n.kwai_id,n.agencia_id,n.nome_agencia,n.apelido_streamer,
        n.nome_agente,n.duracao_transmissao,n.dias_transmissao,n.dias_efetivos,
        n.fluxo_presentes,n.novos_fas,n.duracao_video,n.duracao_audio,
        n.receita_video,n.receita_audio,n.dias_video,n.presentes_convidado_video,
        n.presentes_streamer_video,n.presentes_convidado_audio,
        n.presentes_streamer_audio,n.duracao_chat,n.sala_chat,n.fluxo_caixa_magica,
        n.mes,n.ano,n.updated_at
 from nomes n cross join usuario u
 where n.chave = u.chave
    or (u.chave in ('admgame','admgamer','admgameover','admgamerover')
        and n.chave in ('admgame','admgamer','admgameover','admgamerover'))
    or (u.chave in ('admvovo','admvovomalokeiro','admvovomaloqueiro')
        and n.chave in ('admvovo','admvovomalokeiro','admvovomaloqueiro'));
$$;
revoke all on function public.agencia_meus_hosts_variacoes() from public, anon;
grant execute on function public.agencia_meus_hosts_variacoes() to authenticated;
