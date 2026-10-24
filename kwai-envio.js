// Incluir após supabase.js e após autenticação na central_voyager.html.
// Requer extensão com o protocolo MARAVILHA_KWAI_ENVIAR implementado.
export function instalarEnvioKwai({supabase, getSolicitacao, getRecrutador, destino}) {
  const botao=document.createElement('button');
  botao.type='button';botao.className='btn btn-success';
  botao.textContent='Enviar convite ao Kwai';
  destino.appendChild(botao);
  let emAndamento=false;
  const padronizar=n=>/^(adm game|adm game over|adm gamer|adm gamer over)$/i.test(String(n||'').trim())?'Adm Gamer Over':String(n||'').trim();
  botao.addEventListener('click',async()=>{
    if(emAndamento)return;
    const solicitacao=getSolicitacao();
    if(!solicitacao){alert('Selecione uma solicitação.');return;}
    if(['enviado','confirmado','vinculo_existente'].includes(solicitacao.status)){alert('Convite já enviado ou vínculo existente.');return;}
    emAndamento=true;botao.disabled=true;
    try{
      const {data:consultas,error:erroConsulta}=await supabase.from('agencia_consultas_voyager').select('uid_host,nome_host,liberado,status').eq('kwai_id',solicitacao.kwai_id).eq('status','concluida').order('criado_em',{ascending:false}).limit(1);
      if(erroConsulta)throw erroConsulta;
      const consulta=consultas?.[0];
      const uid=String(consulta?.uid_host||'');
      if(!consulta||consulta.liberado!==true||!/^\d{6,20}$/.test(uid))throw Error('Host sem UID válido ou não liberado pelo Kwai.');
      const agente=padronizar(getRecrutador());
      const nome=String(consulta.nome_host||solicitacao.nome_host||'').trim();
      if(!agente||!nome)throw Error('Nome do recrutador ou da host ausente.');
      if(!confirm(`Enviar convite REAL ao Kwai?\nHost: ${nome}\nUID: ${uid}\nRecrutador: ${agente}`))return;
      const {data:atual,error:erroAtual}=await supabase.from('agencia_solicitacoes_ingresso').select('status').eq('id',solicitacao.id).single();
      if(erroAtual)throw erroAtual;
      if(['enviado','confirmado','vinculo_existente'].includes(atual.status))throw Error('Esta solicitação já foi enviada.');
      const payload={memberId:Number(uid),contractMonths:-1,agreementId:2,brokerName:agente,byAnchor:0,comment:String(solicitacao.informacoes_adicionais||'').slice(0,200),areaCode:'+55',contactInfo:'41991161317',contactType:1,platformType:99,platformId:String(solicitacao.id_plataforma||''),platformInfoUrl:'',platformLink:'',toAnchorExtraMsg:'',userName:nome};
      const requestId=crypto.randomUUID();
      const resposta=await new Promise((resolve,reject)=>{
        const timer=setTimeout(()=>{window.removeEventListener('message',receber);reject(Error('Tempo esgotado. CONFIRA o histórico de convites antes de tentar novamente.'))},30000);
        function receber(event){if(event.source!==window||event.origin!==location.origin||event.data?.type!=='MARAVILHA_KWAI_ENVIAR_RESPOSTA'||event.data.requestId!==requestId)return;clearTimeout(timer);window.removeEventListener('message',receber);resolve(event.data.resposta)}
        window.addEventListener('message',receber);
        window.postMessage({type:'MARAVILHA_KWAI_ENVIAR',requestId,payload},location.origin);
      });
      if(resposta?.result!==1)throw Error(resposta?.message||resposta?.error||'Envio não confirmado pelo Kwai.');
      const {error:erroSalvar}=await supabase.from('agencia_solicitacoes_ingresso').update({status:'enviado',retorno_verificacao:'Convite enviado ao Kwai — aguardando aceite',updated_at:new Date().toISOString()}).eq('id',solicitacao.id);
      if(erroSalvar)throw Error('Kwai aceitou o convite, mas o Supabase não gravou: '+erroSalvar.message+'. NÃO REENVIE.');
      alert('Convite enviado ao Kwai. Aguardando aceite da streamer.');location.reload();
    }catch(e){alert('Envio não confirmado: '+e.message)}finally{emAndamento=false;botao.disabled=false}
  });
}
