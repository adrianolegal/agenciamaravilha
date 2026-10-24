// Adiciona consulta remota ao formulário existente, sem instalar extensão no recrutador.
import {supabase} from './supabase.js';
const $=id=>document.getElementById(id);
const {data:{user}}=await supabase.auth.getUser();
if(user&&$('kwai')&&$('check')){
 const btn=document.createElement('button');btn.type='button';btn.className='btn btn-outline-warning btn-sm';btn.textContent='Consultar Kwai';const buttonRow=document.createElement('div');buttonRow.style.cssText='margin-top:10px;min-height:38px;display:flex;align-items:flex-start';buttonRow.append(btn);$('kwai').parentElement.append(buttonRow);
 const status=$('check');status.style.cssText='display:block;min-height:42px;margin-top:6px';let current=null,interval=null;const uidLabel=document.createElement('div');uidLabel.id='uidKwaiResultado';uidLabel.style.cssText='color:#a5d8ff;font-size:.9rem;margin-top:6px;min-height:22px';uidLabel.textContent='UID Kwai: aguardando consulta';$('nome').parentElement.append(uidLabel);
 btn.onclick=async()=>{
  const id=$('kwai').value.trim();if(!/^[\w.-]{3,80}$/.test(id)){status.textContent='Informe um Kwai ID válido';return}
  if(interval)clearInterval(interval);current=null;uidLabel.textContent='UID Kwai: consultando...';btn.disabled=true;status.textContent='Aguardando consulta no computador administrativo...';
  const {data,error}=await supabase.from('agencia_consultas_voyager').insert({solicitante_id:user.id,kwai_id:id}).select('id').single();
  if(error){status.textContent='Erro ao solicitar consulta: '+error.message;btn.disabled=false;return}
  const queryId=data.id;let checks=0;
  async function refresh(){
   if($('kwai').value.trim()!==id){clearInterval(interval);btn.disabled=false;return}
   const {data:r,error:e}=await supabase.from('agencia_consultas_voyager').select('status,nome_host,uid_host,liberado,mensagem').eq('id',queryId).single();
   if(e){clearInterval(interval);btn.disabled=false;status.textContent='Falha ao acompanhar consulta: '+e.message;return}
   if(r.status==='concluida'||r.status==='erro'){
    clearInterval(interval);btn.disabled=false;
    if(r.nome_host)$('nome').value=r.nome_host;else $('nome').value='';uidLabel.textContent=r.uid_host?'UID Kwai: '+r.uid_host:'UID Kwai: não retornado pela consulta';
    current={id,liberado:r.status==='concluida'&&r.liberado===true};
    const msg=String(r.mensagem||'');const missing=/sem UID reconhecido|member\/name|não localizad|nao localizad|não encontrad|nao encontrad|not found|no results/i.test(msg);status.textContent=r.status==='erro'?(missing?'Kwai ID não localizado. Confira se o usuário alterou seu ID.':'Não foi possível concluir a consulta ao Kwai: '+msg):r.liberado?'Kwai: liberado para análise':'Kwai: impedido — '+msg;
    status.style.color=current.liberado?'#86efac':'#fca5a5';return;
   }
   if(++checks>=60){clearInterval(interval);btn.disabled=false;status.textContent='Consulta pendente: mantenha a central administrativa aberta no Chrome administrativo.'}
  }
  await refresh();if(!current&&checks<60)interval=setInterval(refresh,3000);
 };
 $('kwai').addEventListener('input',()=>{current=null;uidLabel.textContent='UID Kwai: aguardando consulta';status.style.color='';});
 // Captura submissão antes do handler antigo; nunca permite envio após negativa confirmada.
 $('form')?.addEventListener('submit',event=>{if(current?.id===$('kwai').value.trim()&&!current.liberado){event.preventDefault();event.stopImmediatePropagation();status.textContent='Ingresso impedido pelo Kwai. Não é possível registrar este pedido como liberado.'}},true);
}
