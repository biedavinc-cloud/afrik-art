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
Les adresses du secret `SUPERADMIN_EMAILS` reçoivent le rôle `admin` dès que leur e-mail est vérifié.
Inscrire une adresse déjà utilisée ne révèle rien à l'écran (le titulaire est prévenu par e-mail) : pas d'énumération de comptes.

## Données sensibles

Le dépôt est public : aucune adresse, clé ni secret n'y figure (secrets Cloudflare uniquement).
Côté API, `created_by` (e-mail de l'auteur) et les champs de `PRIVATE_FIELDS` sont retirés pour tout lecteur qui n'est ni
admin ni propriétaire. Les formulaires publics (contact, messagerie) sont limités par IP et par destinataire.

## Espace superadmin

`/admin/systeme` : état des services + e-mail de test avec le code d'erreur Cloudflare. `/admin/import` : import JSON/CSV
idempotent et articles d'exemple (`src/server/example-posts.js`). Une inscription dont l'e-mail n'a pas pu partir le signale
à l'écran (`emailed: false`) sans révéler si l'adresse a déjà un compte.

## E-mails

Modèles dans `src/server/mail-templates.js`, textes dans `src/server/mail-i18n.js` (fr, en, es, pt, sw : la langue du
visiteur est transmise par le navigateur et mémorisée sur le compte). Tout texte utilisateur y est échappé.

## Configuration (`wrangler.jsonc`)

Variables : `PUBLIC_URL`, `MAIL_FROM`, `ENVIRONMENT`. Secrets (tableau de bord Cloudflare ou `wrangler secret put`) :
`SUPERADMIN_EMAILS` (obligatoire), `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` (optionnels).
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
