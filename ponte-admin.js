// Executa SOMENTE na central_voyager.html do administrador, no Chrome com a extensão instalada.
import {supabase} from './supabase.js';
const {data:{user}}=await supabase.auth.getUser();
const {data:profile}=user?await supabase.from('agencia_usuarios').select('perfil,ativo').eq('user_id',user.id).maybeSingle():{data:null};
if(profile?.perfil==='administrador'&&profile?.ativo){
 const label=document.createElement('p');label.style.cssText='padding:10px;color:#facc15';label.textContent='Ponte Voyager: iniciando...';document.querySelector('main')?.prepend(label);
 function consultar(kwaiId){return new Promise((resolve,reject)=>{
  const requestId=crypto.randomUUID();const handler=e=>{if(e.source!==window||e.origin!==location.origin||e.data?.type!=='MARAVILHA_VOYAGER_RESULT'||e.data.requestId!==requestId)return;clearTimeout(timeout);window.removeEventListener('message',handler);resolve(e.data.result||{error:'Sem resposta'})};
  const timeout=setTimeout(()=>{window.removeEventListener('message',handler);reject(Error('Extensão não respondeu em 20 segundos'))},20000);
  window.addEventListener('message',handler);window.postMessage({type:'MARAVILHA_VOYAGER_CHECK',kwaiId,requestId},location.origin);
 })}
 let busy=false;
 async function tick(){if(busy)return;busy=true;try{
  const {data,error}=await supabase.from('agencia_consultas_voyager').select('id,kwai_id,criado_em').eq('status','pendente').order('criado_em',{ascending:true}).limit(5);
  if(error)throw error;
  label.textContent='Ponte Voyager ativa — '+(data?.length||0)+' consulta(s) aguardando';
  for(const row of data||[]){
   const {data:claimed,error:claimError}=await supabase.from('agencia_consultas_voyager').update({status:'processando',atualizado_em:new Date().toISOString()}).eq('id',row.id).eq('status','pendente').select('id');
   if(claimError||!claimed?.length)continue;
   try{const result=await consultar(row.kwai_id);const valid=result.status==='consultado'&&typeof result.eligible==='boolean';const uid=result.uid??result.memberId??result.member_id??result.userId??result.data?.memberId??result.data?.uid??null;
    const {error:saveError}=await supabase.from('agencia_consultas_voyager').update({status:valid?'concluida':'erro',nome_host:result.name||null,uid_host:uid?String(uid):null,liberado:valid?result.eligible:null,mensagem:valid?(result.message||'Consulta concluída'):(result.error||'Resposta não reconhecida'),atualizado_em:new Date().toISOString()}).eq('id',row.id);if(saveError)throw saveError;
   }catch(e){await supabase.from('agencia_consultas_voyager').update({status:'erro',mensagem:e.message,atualizado_em:new Date().toISOString()}).eq('id',row.id)}
  }
 }catch(e){label.textContent='Ponte Voyager: '+e.message}finally{busy=false}}
 await tick();setInterval(tick,4000);
}
