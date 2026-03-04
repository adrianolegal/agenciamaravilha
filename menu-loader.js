// menu-loader.js
import { supabase } from "./supabase.js";

function getMenuHolder() {
  return (
    document.getElementById("menu-container") ||
    document.getElementById("menu-placeholder")
  );
}

export async function loadMenu() {
  const holder = getMenuHolder();
  if (!holder) return;

  // carrega o HTML do menu
  const html = await fetch("menu1.html", { cache: "no-store" }).then(r => r.text());
  holder.innerHTML = html;

  // pega user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // pega filial do profile
  const { data: prof, error: profErr } = await supabase
    .from("profiles")
    .select("filial")
    .eq("id", user.id)
    .single();

  if (profErr) {
    console.error("[MENU] erro profile:", profErr);
    return;
  }

  const filial = (prof?.filial || "").trim();
  const filialLower = filial.toLowerCase();

  
