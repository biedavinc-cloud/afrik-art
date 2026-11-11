import { env } from "cloudflare:workers";

// Schéma D1. Il est appliqué automatiquement au premier accès (CREATE ... IF NOT EXISTS) : aucune
// migration à lancer à la main, ni au premier déploiement ni après.
//
// Les enregistrements des entités vivent dans une table documentaire `records` (JSON) : ajouter un
// champ à une entité ne demande donc aucune migration. Les index d'expression ci-dessous couvrent les
// champs filtrés en permanence par l'application.
const HOT_FIELDS = [
  "user_id",
  "slug",
  "status",
  "profile_id",
  "thread_id",
  "artist_user_id",
  "client_user_id",
  "author_user_id",
  "owner_email",
  "kind",
];

const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    password_hash TEXT,
    email_verified INTEGER NOT NULL DEFAULT 0,
    google_sub TEXT UNIQUE,
    avatar_url TEXT,
    created_date TEXT NOT NULL,
    updated_date TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)`,
  `CREATE TABLE IF NOT EXISTS auth_codes (
    purpose TEXT NOT NULL,
    key TEXT NOT NULL,
    code_hash TEXT NOT NULL,
    user_id TEXT,
    attempts INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    PRIMARY KEY (purpose, key)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_auth_codes_hash ON auth_codes(purpose, code_hash)`,
  `CREATE TABLE IF NOT EXISTS throttle (
    key TEXT PRIMARY KEY,
    count INTEGER NOT NULL,
    reset_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS records (
    entity TEXT NOT NULL,
    id TEXT NOT NULL,
    data TEXT NOT NULL,
    created_date TEXT NOT NULL,
    updated_date TEXT NOT NULL,
    created_by TEXT,
    created_by_id TEXT,
    PRIMARY KEY (entity, id)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_records_created ON records(entity, created_date)`,
  `CREATE INDEX IF NOT EXISTS idx_records_owner ON records(entity, created_by_id)`,
  ...HOT_FIELDS.map(
    (f) => `CREATE INDEX IF NOT EXISTS idx_records_${f} ON records(entity, json_extract(data, '$.${f}'))`,
  ),
];

let ready;

// Appliqué une seule fois par instance du Worker.
export function ensureSchema() {
  ready ??= env.DB.batch(STATEMENTS.map((sql) => env.DB.prepare(sql))).catch((error) => {
    ready = undefined; // on réessaiera à la requête suivante
    throw error;
  });
  return ready;
}

// Contrôle de santé : D1 répond, et quels services sont reliés.
export async function health() {
  await ensureSchema();
  await env.DB.prepare("SELECT 1").first();
  return { database: "ok", storage: env.FILES ? "ok" : "missing", email: env.EMAIL ? "ok" : "missing" };
}
