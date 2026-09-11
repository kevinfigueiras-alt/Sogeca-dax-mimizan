// Charge les données de départ (data/*_seed.json) dans la table kv_store de Supabase.
// Usage : npm run seed
// Nécessite les variables d'environnement VITE_SUPABASE_URL et
// VITE_SUPABASE_ANON_KEY (dans un fichier .env, chargé automatiquement par Node
// si vous utilisez `node --env-file=.env scripts/seed.mjs`, ou exportez-les
// manuellement dans votre terminal avant de lancer la commande).

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "Variables manquantes. Lancez plutôt :\n" +
    "  node --env-file=.env scripts/seed.mjs\n" +
    "(ou exportez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans votre terminal)"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const entries = [
  ["sogeca-portefeuille-clients", "clients_seed.json"],
  ["sogeca-charges-fixes", "charges_seed.json"],
  ["sogeca-prospects", "prospects_seed.json"],
  ["sogeca-pca", "pca_seed.json"],
  ["sogeca-primes", "primes_seed.json"],
];

for (const [key, file] of entries) {
  const path = join(__dirname, "..", "data", file);
  const value = JSON.parse(readFileSync(path, "utf-8"));
  const { error } = await supabase
    .from("kv_store")
    .upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) {
    console.error(`Échec pour ${key} :`, error.message);
  } else {
    console.log(`OK : ${key} (${file})`);
  }
}

console.log("Import terminé.");
