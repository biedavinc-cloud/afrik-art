// Définition des entités (schémas JSON + règles d'accès RLS) et politique de sécurité du navigateur.
const modules = import.meta.glob("./entities/*.json", { eager: true, import: "default" });

export const ENTITIES = Object.fromEntries(Object.values(modules).map((def) => [def.name, def]));

// Règle par défaut quand un schéma n'en déclare pas : administrateurs seulement.
export const ADMIN_ONLY = { user_condition: { role: "admin" } };

export function ruleFor(def, action) {
  const rule = def.rls?.[action];
  return rule === undefined ? ADMIN_ONLY : rule;
}

/**
 * Ce que le NAVIGATEUR n'a pas le droit de faire directement via /api/db, même quand les règles RLS
 * le permettraient : ces écritures passent exclusivement par des fonctions serveur qui font
 * leurs propres vérifications (paiement, modération, messagerie, secrets).
 */
export const BROWSER_BLOCKED = {
  // Clés d'API des prestataires : jamais exposées au navigateur, même à un admin.
  Integration: ["list", "filter", "get", "create", "update", "delete", "count", "updateMany"],
  Payment: ["create"],
  Subscription: ["create"],
  Promotion: ["create"],
  BlogPost: ["create", "update", "delete", "updateMany"],
  Message: ["create", "update", "delete", "updateMany"],
  MessageThread: ["create", "update", "delete", "updateMany"],
};

/**
 * Champs qu'un utilisateur non administrateur ne peut jamais écrire lui-même, à la création comme à la
 * modification (ils sont ignorés silencieusement) : sinon n'importe qui pourrait s'attribuer le plan
 * premium, la certification ou se réactiver après une suspension.
 */
export const PROTECTED_FIELDS = {
  ArtistProfile: ["plan", "plan_status", "plan_ends_at", "verified", "status", "views", "featured_until", "is_demo"],
};
