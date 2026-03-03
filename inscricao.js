// inscricao.js
const btnEnviar = document.getElementById('btnEnviar');
const status = document.getElementById('status');

const uid = document.getElementById('uid');
const apelido = document.getElementById('apelido');
const kwai_id = document.getElementById('kwai_id');
const horarioGroup = document.getElementById('horarioGroup');

let selectedHora = null;

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

// Envio inscrição
btnEnviar.addEventListener('click', async () => {
  if (!uid.textContent || !apelido.textContent || !kwai_id.textContent) {
    status.textContent = 'Selecione um host válido';
    return;
  }
  if (!selectedHora) {
    status.textContent = 'Selecione um horário';
    return;
  }

  status.textContent = 'Enviando inscrição...';
  const ip = await getUserIP();
  const mesAtual = new Date().getMonth() + 1;

  const payload = {
    member_id: parseInt(uid.textContent),
    kwai_id: kwai_id.textContent,
    hora_escolhida: selectedHora,
    ip_usuario: ip,
    mes: mesAtual
  };

  try {
    // Chama a Edge Function no Supabase
    const res = await fetch('https://<SEU-PROJETO>.supabase.co/functions/v1/inscricao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json();
      status.textContent = 'Erro ao salvar: ' + (err.message || res.statusText);
      return;
    }

    status.textContent = 'Inscrição salva com sucesso!';
  } catch (err) {
    status.textContent = 'Erro ao enviar: ' + err.message;
  }
});
