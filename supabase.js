// supabase.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.32.0/dist/module/index.js";

export const supabase = createClient(
  "https://qgsfmiywdohyb "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnc2ZtaXl3ZG9oeWJxbG54aGR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNzg3MzAsImV4cCI6MjA4Nzg1NDczMH0.Ku7lQF-YzwyPqm_igXk3tYnfgmSalzsHNmmVBP9NCp0"

);

export async function protectPage() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) window.location.href = "login.html";
}

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session;
}

export async function logout() {
  await supabase.auth.signOut();
  window.location.href = "login.html";
}
