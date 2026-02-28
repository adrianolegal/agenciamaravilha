// supabase.js
// 🔒 Configuração do Supabase centralizada (anon key só aqui)

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/supabase.min.js";

const SUPABASE_URL = "https://qgsfmiywdohybqlnxhdw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnc2ZtaXl3ZG9oeWJxbG54aGR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNzg3MzAsImV4cCI6MjA4Nzg1NDczMH0.Ku7lQF-YzwyPqm_igXk3tYnfgmSalzsHNmmVBP9NCp0";

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ✅ Função de login
export async function login(email, password) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session;
}

// ✅ Função de logout
export async function logout() {
  await supabaseClient.auth.signOut();
}

// ✅ Função para verificar sessão
export async function checkAuth() {
  const { data } = await supabaseClient.auth.getSession();
  return data.session;
}
