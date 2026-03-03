// inscrição.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'YOUR_SUPABASE_URL'; // do projeto Supabase
const supabaseKey = 'YOUR_SUPABASE_SERVICE_ROLE_KEY'; // Service Role segura
const supabase = createClient(supabaseUrl, supabaseKey);

const hostSearch = document.getElementById('hostSearch');
const uid = document.getElementById('uid');
const apelido = document.getElementById('apelido');
const kwai_id = document.getElementById('kwai_id');
const kwaiPreview = document.getElementById('kwaiPreview');
const kwaiLink = document.getElementById('kwaiLink');
const kwaiProfileImg = document.getElementById('kwaiProfileImg');
const kwaiName = document.getElementById('kwaiName');

const horarioGroup = document.getElementById('horarioGroup');
const btnEnviar = document.getElementById('btnEnviar');
const status = document.getElementById('status');

let hostsData = []; // preencha manualmente ou via Supabase fetch seguro
let selectedHost = null;
let selectedHora = null;

// Busca host localmente
hostSearch.addEventListener('input', e => {
  const filtro = e.target.value.toLowerCase();
  const encontrado = hostsData.find(h => h.apelido.toLowerCase().includes(filtro) || h.kwai_id.toLowerCase().includes(filtro));
  if (encontrado) {
    selectedHost = encontrado;
    uid.textContent = encontrado.member_id;
    apelido.textContent = encontrado.apelido;
    kwai_id.textContent = encontrado.kwai_id;

    kwaiPreview.style.display = 'block';
    kwaiLink.href = `https://kwai.com/@${encontrado.kwai_id}`;
    kwaiName.textContent = encontrado.apelido;

    kwaiProfileImg.src = encontrado.avatar_url || 'profile-placeholder.jpg';
  } else {
    selectedHost = null;
    uid.textContent = '';
    apelido.textContent = '';
    kwai_id.textContent = '';
    kwaiPreview.style.display = 'none';
  }
});

// Seleção de horário
horarioGroup.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => {
    horarioGroup.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedHora = btn.dataset.hora;
  });
});

// Pegar IP do usuário
async function getUserIP() {
  try {
    const resp = await fetch('https://api.ipify.org?format=json');
    const data = await resp.json();
    return data.ip;
  } catch {
    return 'desconhecido';
  }
}

// Envio inscrição direto para Supabase
btnEnviar.addEventListener('click', async () => {
  if (!selectedHost) { status.textContent = 'Selecione um host válido'; return; }
  if (!selectedHora) { status.textContent = 'Selecione um horário'; return; }

  status.textContent = 'Enviando inscrição...';
  const ip = await getUserIP();
  const mesAtual = new Date().getMonth() + 1;

  try {
    const { data, error } = await supabase
      .from('inscricoes_pk_agencias')
      .insert([{
        member_id: selectedHost.member_id,
        kwai_id: selectedHost.kwai_id,
        hora_escolhida: selectedHora,
        ip_usuario: ip,
        mes: mesAtual
      }]);

    if (error) {
      status.textContent = 'Erro ao salvar: ' + error.message;
      return;
    }

    status.textContent = 'Inscrição salva com sucesso!';
  } catch (err) {
    status.textContent = 'Erro ao enviar: ' + err.message;
  }
});
