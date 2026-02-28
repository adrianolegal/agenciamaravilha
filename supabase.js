// supabase.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Configuração pública do Supabase (segura para o frontend)
const SUPABASE_URL = "https://qgsfmiywdohybqlnxhdw.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnc2ZtaXl3ZG9oeWJxbG54aGR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNzg3MzAsImV4cCI6MjA4Nzg1NDczMH0.Ku7lQF-YzwyPqm_igXk3tYnfgmSalzsHNmmVBP9NCp0";

// Criação do cliente Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Função utilitária para verificar autenticação do usuário
export async function checkUserSession() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
// 🔒 ADICIONE ESTA FUNÇÃO
export async function logout() {
  await supabase.auth.signOut();
  window.location.href = "login.html";
}
// Redireciona automaticamente se o usuário não estiver logado
export async function protectPage() {
  const user = await checkUserSession();
  if (!user) window.location.href = "login.html";
}
