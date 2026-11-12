# Afrik Art

Plateforme panafricaine de promotion des talents. Application TanStack Start déployée sur **Cloudflare**
(Worker + D1 + R2 + Email Service) — sans aucun service tiers obligatoire.

## Super administrateurs

Leurs adresses ne sont **pas** dans le dépôt (il est public) : elles se définissent comme **secret** Cloudflare
`SUPERADMIN_EMAILS` (adresses séparées par des virgules) — Worker > Settings > Variables and Secrets > Add > type « Secret ».
Le rôle `admin` est attribué automatiquement dès que l'adresse est **vérifiée** (inscription avec code, ou Google).
Ces comptes gèrent ensuite les autres rôles depuis `/admin/utilisateurs`.
`/api/health` indique `"superadmins":"ok"` quand le secret est défini (jamais les adresses).

## Déploiement

1. Cloudflare > Workers & Pages > projet Git `afrik-art`, branche `main`.
   Build : `npm run build` · Deploy : `npx wrangler deploy`.
2. Au premier déploiement, Cloudflare crée tout seul la base D1 `afrik-art-db` et le bucket R2 `afrik-art-files`.
   Le schéma de la base s'applique au premier accès : rien à migrer.
3. **E-mails** : Cloudflare > Email Service, valider le domaine `afrik.cloud` (adresse expéditrice `MAIL_FROM`).
   Sans cela, personne ne reçoit le code de vérification.
4. **Domaine** : Worker > Settings > Domains & Routes > `afrik.cloud`.
5. *(Optionnel)* Connexion Google : créer un identifiant OAuth sur Google Cloud avec l'URI de redirection
   `https://afrik.cloud/api/auth/google-callback`, puis définir les secrets `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET`.
6. Contrôle : `https://afrik.cloud/api/health` doit répondre `ok` pour `database`, `storage`, `email` et `superadmins`.

Le nom du Worker dans `wrangler.jsonc` doit rester identique à celui du tableau de bord Cloudflare.

## Développement

Voir `AGENTS.md`.
