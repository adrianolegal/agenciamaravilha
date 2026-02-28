// supabase.js
// Não usar export/import
const SUPABASE_URL = "https://qgsfmiywdohybqlnxhdw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnc2ZtaXl3ZG9oeWJxbG54aGR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNzg3MzAsImV4cCI6MjA4Nzg1NDczMH0.Ku7lQF-YzwyPqm_igXk3tYnfgmSalzsHNmmVBP9NCp0"; // coloque anon key apenas aqui

// Objeto global supabaseClient
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Função de login
function login(email, password) {
  return supabaseClient.auth.signInWithPassword({ email, password })
    .then(({ data, error }) => {
      if (error) throw error;
      return data.session;
    });
}

// Função logout
function logout() {
  return supabaseClient.auth.signOut();
}

// Função verificar sessão
function checkAuth() {
  return supabaseClient.auth.getSession().then(({ data }) => data.session);
}
