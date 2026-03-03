// inscricao.js
const btnEnviar = document.getElementById('btnEnviar');
const hostSearch = document.getElementById('hostSearch');
const uid = document.getElementById('uid');
const apelido = document.getElementById('apelido');
const kwai_id = document.getElementById('kwai_id');
const kwaiPreview = document.getElementById('kwaiPreview');
const kwaiLink = document.getElementById('kwaiLink');
const kwaiProfileImg = document.getElementById('kwaiProfileImg');
const kwaiName = document.getElementById('kwaiName');
const horarioGroup = document.getElementById('horarioGroup');
const status = document.getElementById('status');

let selectedHost = null;
let selectedHora = null;

// Seleção do host (igual HTML inline anterior)
hostSearch.addEventListener('input', e => {
  const filtro = e.target.value.toLowerCase();

  // Busca diretamente na tabela HTML já carregada
  const hosts = JSON.parse(localStorage.getItem('hostsData') || '[]');
  const encontrado = hosts.find(h => h.apelido.toLowerCase().includes(filtro) || h.kwai_id.toLowerCase().includes(filtro));

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

// Função para enviar inscrição para a Edge Function
async function enviarInscricao(payload) {
  try {
    const res = await fetch('https://<SEU_DOMINIO_SUPABASE_EDGE>/inscricao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || res.statusText);
    }

    return await res.json();
  } catch (err) {
    throw err;
  }
}

// Botão enviar
btnEnviar.addEventListener('click', async () => {
  if (!selectedHost) { status.textContent = 'Selecione um host válido'; return; }
  if (!selectedHora) { status.textContent = 'Selecione um horário'; return; }

  status.textContent = 'Enviando inscrição...';
  const ip = await getUserIP();
  const mesAtual = new Date().getMonth() + 1;

  const payload = {
    member_id: selectedHost.member_id,
    kwai_id: selectedHost.kwai_id,
    hora_escolhida: selectedHora,
    ip_usuario: ip,
    mes: mesAtual
  };

  try {
    await enviarInscricao(payload);
    status.textContent = 'Inscrição salva com sucesso!';
  } catch (err) {
    status.textContent = 'Erro ao enviar: ' + err.message;
  }
});
