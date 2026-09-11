// Couche de stockage qui remplace window.storage (spécifique à Claude).
//
// - Si les variables VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont définies,
//   les données sont lues/écrites dans la table `kv_store` de Supabase (voir
//   supabase/schema.sql) : elles sont alors partagées entre tous les
//   utilisateurs du site, comme c'était le cas dans Claude.
// - Sinon, on utilise le localStorage du navigateur : les données restent
//   propres à cet ordinateur / ce navigateur (pratique pour tester en local).

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabase = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = hasSupabase
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

/**
 * Récupère une valeur JSON stockée sous `key`.
 * Retourne `null` si la clé n'existe pas encore.
 */
export async function storageGet(key) {
  if (hasSupabase) {
    const { data, error } = await supabase
      .from("kv_store")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (error) throw error;
    return data ? data.value : null;
  }
  const raw = window.localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

/**
 * Enregistre une valeur JSON sous `key` (upsert).
 */
export async function storageSet(key, value) {
  if (hasSupabase) {
    const { error } = await supabase
      .from("kv_store")
      .upsert({ key, value, updated_at: new Date().toISOString() });
    if (error) throw error;
    return true;
  }
  window.localStorage.setItem(key, JSON.stringify(value));
  return true;
}
