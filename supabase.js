// supabase.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.0/dist/supabase.js";

const SUPABASE_URL = "https://qgsfmiywdohybqlnxhdw.supabase.co";
const SUPABASE_ANON_KEY = "SUA_ANON_KEY_AQUI"; // coloque anon key apenas aqui

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function login(email, password) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session;
}

export async function checkAuth() {
  const { data } = await supabaseClient.auth.getSession();
  return data.session;
}

export async function logout() {
  await supabaseClient.auth.signOut();
}
