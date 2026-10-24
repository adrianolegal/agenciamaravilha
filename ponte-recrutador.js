// Adiciona consulta remota ao formulário existente, sem instalar extensão no recrutador.
import {supabase} from './supabase.js';
const $=id=>document.getElementById(id);
const {data:{user}}=await supabase.auth.getUser();
if(user&&$('kwai')&&$('check')){
 const btn=document.createElement('button');btn.type='button';btn.className='btn btn-outline-warning btn-sm mt-2';btn.textContent='Consultar Voyager (remoto)';$('check').after(btn);
 const status=$('check');let current=null,interval=null;const uidLabel=document.createElement('div');uidLabel.style.cssText='color:#a5d8ff;font-size:.9rem;margin-top:4px';$('nome').parentElement.append(uidLabel);
 btn.onclick=async()=>{
  const id=$('kwai').value.trim();if(!/^[\w.-]{3,80}$/.test(id)){status.textContent='Informe um Kwai ID válido';return}
  if(interval)clearInterval(interval);current=null;btn.disabled=true;status.textContent='Aguardando consulta no computador administrativo...';
  const {data,error}=await supabase.from('agencia_consultas_voyager').insert({solicitante_id:user.id,kwai_id:id}).select('id').single();
  if(error){status.textContent='Erro ao solicitar consulta: '+error.message;btn.disabled=false;return}
  const queryId=data.id;let checks=0;
  async function refresh(){
   if($('kwai').value.trim()!==id){clearInterval(interval);btn.disabled=false;return}
   const {data:r,error:e}=await supabase.from('agencia_consultas_voyager').select('status,nome_host,uid_host,liberado,mensagem').eq('id',queryId).single();
   if(e){clearInterval(interval);btn.disabled=false;status.textContent='Falha ao acompanhar consulta: '+e.message;return}
   if(r.status==='concluida'||r.status==='erro'){
    clearInterval(interval);btn.disabled=false;
    if(r.nome_host)$('nome').value=r.nome_host;uidLabel.textContent=r.uid_host?'UID Kwai: '+r.uid_host:'';
    current={id,liberado:r.status==='concluida'&&r.liberado===true};
    status.textContent=r.status==='erro'?'Voyager: falha — '+r.mensagem:r.liberado?'Voyager: liberado para análise':'Voyager: impedido — '+r.mensagem;
    status.style.color=current.liberado?'#86efac':'#fca5a5';return;
   }
   if(++checks>=60){clearInterval(interval);btn.disabled=false;status.textContent='Consulta pendente: mantenha a Central Voyager aberta no Chrome administrativo.'}
  }
  await refresh();if(!current&&checks<60)interval=setInterval(refresh,3000);
 };
 $('kwai').addEventListener('input',()=>{current=null;uidLabel.textContent='';status.style.color='';});
 // Captura submissão antes do handler antigo; nunca permite envio após negativa confirmada.
 $('form')?.addEventListener('submit',event=>{if(current?.id===$('kwai').value.trim()&&!current.liberado){event.preventDefault();event.stopImmediatePropagation();status.textContent='Ingresso impedido pelo Voyager. Não é possível registrar este pedido como liberado.'}},true);
}
