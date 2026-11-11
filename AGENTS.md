# Afrik Art — guide technique

Application TanStack Start (React) hébergée **uniquement sur Cloudflare** : un Worker, une base D1, un
bucket R2 et Cloudflare Email Service. Aucune dépendance à Base44.

## Architecture

| Besoin | Solution | Où |
| --- | --- | --- |
| Pages + serveur | Worker Cloudflare (TanStack Start, SSR) | `src/server.js`, `src/routes/` |
| Données | D1 (SQLite), table documentaire `records` | `src/server/data.server.js` |
| Schémas + règles d'accès (RLS) | JSON par entité | `src/server/entities/*.json` |
| Comptes / sessions | D1 + cookie `aa_session` (HttpOnly) | `src/server/auth.server.js` |
| Fichiers publics | R2, servis sur `/files/*` | `src/server/files.server.js` |
| E-mails | Cloudflare Email Service (binding `EMAIL`) | `src/server/mail.server.js` |

Le schéma D1 s'applique tout seul au premier accès (`src/server/schema.server.js`) : aucune migration à lancer.
Ajouter un champ à une entité = éditer son JSON ; aucune migration de base.

## Accès aux données

- **Navigateur** : `import { api } from "@/api/client"` puis `api.entities.X.filter(...)`. Chaque appel passe par
  `POST /api/db`; le serveur applique les règles `rls` du schéma de l'entité.
  `BROWSER_BLOCKED` et `PROTECTED_FIELDS` (`src/server/entities.js`) ajoutent des garde-fous : paiements, blog,
  messagerie et clés d'API ne s'écrivent que depuis le serveur ; plan, certification et statut d'un profil
  ne sont modifiables que par un admin.
- **Fonctions serveur** (`createServerFn`) : `context.getApi()` donne `entities` (droits du visiteur) et
  `asServiceRole.entities` (accès complet : toujours authentifier l'appelant avant).
  Ajouter `.middleware([requireUser])` pour exiger une session.
- Règles RLS : `{}` = public · `{ "created_by_id": "{{user.id}}" }` · `{ "data.champ": valeur }` ·
  `{ "user_condition": { "role": "admin" } }` · combinaisons `$or` / `$and`. Sans règle : admin uniquement.

## Authentification

E-mail + mot de passe (PBKDF2), code de vérification à 6 chiffres, réinitialisation par lien à usage unique,
Google OAuth (si `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` sont définis). Limitation de débit sur les connexions,
codes et envois. Protection CSRF (`Sec-Fetch-Site` / `Origin`) sur toute requête qui modifie l'état.
Les adresses de `SUPERADMIN_EMAILS` reçoivent le rôle `admin` dès que leur e-mail est vérifié.

## Configuration (`wrangler.jsonc`)

Variables : `PUBLIC_URL`, `MAIL_FROM`, `SUPERADMIN_EMAILS`, `ENVIRONMENT`. Secrets optionnels (tableau de bord
Cloudflare ou `wrangler secret put`) : `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
Les clés des prestataires (paiement, IA) se saisissent dans l'espace superadmin > Connecteurs (stockées en D1,
jamais renvoyées au navigateur).

## Développement

```bash
npm install
npm run dev      # serveur local avec D1/R2 simulés ; ENVIRONMENT=development dans .dev.vars affiche les e-mails dans la console
npm run build    # compile le client et le Worker
```

`.dev.vars` (ignoré par git) : `ENVIRONMENT=development` pour lire les codes de vérification dans les logs.
Ne jamais committer `dist/`, `.wrangler/` ni `node_modules/`.
