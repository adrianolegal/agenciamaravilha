import {supabase} from './supabase.js';
async function applyMenu(){
 const {data:{user}}=await supabase.auth.getUser();if(!user)return;
 const {data:profile}=await supabase.from('agencia_usuarios').select('perfil,ativo').eq('user_id',user.id).maybeSingle();
 if(!profile?.ativo){await supabase.auth.signOut();location.replace('login.html');return}
 document.querySelectorAll('#menu-placeholder [data-admin-only]').forEach(el=>el.style.display=profile.perfil==='administrador'?'':'none');
 const logout=document.getElementById('logoutBtn');if(logout&&!logout.dataset.ready){logout.dataset.ready='1';logout.addEventListener('click',async()=>{await supabase.auth.signOut();location.replace('login.html')})}
}
const placeholder=document.getElementById('menu-placeholder');
if(placeholder){new MutationObserver(()=>{if(placeholder.querySelector('[data-admin-only]'))applyMenu()}).observe(placeholder,{childList:true});if(placeholder.children.length)applyMenu()}
