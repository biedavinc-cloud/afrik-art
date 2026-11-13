import { env } from "cloudflare:workers";

// Envoi d'e-mails transactionnels via Cloudflare Email Service (binding `EMAIL`, aucun fournisseur externe).
// Prérequis : plan Workers payant + domaine d'ENVOI validé dans Cloudflare > Email Service > Email Sending.
// Les modèles (mise en page, textes, langues) sont dans mail-templates.js.

// Expéditeur : MAIL_FROM = "noreply@afrik.cloud" ou "Nom <noreply@afrik.cloud>". Le nom affiché par défaut est « Afrik Art ».
export function senderAddress() {
  const raw = String(env.MAIL_FROM || "noreply@afrik.cloud").trim();
  const named = raw.match(/^(.*?)\s*<([^<>]+)>$/);
  return named ? { email: named[2].trim(), name: named[1].replace(/^"|"$/g, "").trim() || "Afrik Art" } : { email: raw, name: "Afrik Art" };
}

// Explication en français d'un code d'erreur Cloudflare Email Service, avec l'action à mener.
export const MAIL_ERROR_HINTS = {
  E_SENDER_NOT_VERIFIED: "Le domaine expéditeur n'est pas validé. Cloudflare > Email Service > Email Sending : ajoutez et validez le domaine (enregistrements DNS SPF/DKIM).",
  E_SENDER_DOMAIN_NOT_AVAILABLE: "Le domaine n'est pas activé pour l'envoi. Cloudflare > Email Service > Email Sending : « Onboard domain » pour le domaine de MAIL_FROM (l'Email Routing seul ne suffit pas).",
  E_RECIPIENT_NOT_ALLOWED: "Le destinataire est refusé par les restrictions du binding EMAIL (allowed_destination_addresses).",
  E_RECIPIENT_SUPPRESSED: "Cette adresse figure sur la liste de suppression de Cloudflare (rebond précédent). Retirez-la dans Email Service > Suppressions.",
  E_ACCOUNT_SUSPENDED: "L'envoi est suspendu sur le compte Cloudflare (réputation d'expéditeur). Contactez le support Cloudflare.",
  E_RATE_LIMIT_EXCEEDED: "Limite de débit atteinte. Réessayez dans quelques minutes.",
  E_DAILY_LIMIT_EXCEEDED: "Quota quotidien d'envoi atteint (voir la page Limits d'Email Service).",
  E_DELIVERY_FAILED: "Le serveur du destinataire a refusé le message. Vérifiez l'adresse.",
  E_VALIDATION_ERROR: "Adresse invalide ou champ manquant (MAIL_FROM ou destinataire).",
  E_FIELD_MISSING: "Champ obligatoire manquant (to, from ou subject).",
  E_INTERNAL_SERVER_ERROR: "Email Service est momentanément indisponible. Réessayez.",
  NO_BINDING: "Le binding EMAIL est absent du Worker. Vérifiez que wrangler.jsonc contient « send_email: [{ name: EMAIL }] » puis redéployez.",
};

/**
 * Envoie un e-mail et RENVOIE le résultat détaillé : { ok, code, message, messageId }.
 * Ne lève jamais d'exception : à l'appelant de décider quoi faire d'un échec.
 */
export async function sendMailDetailed({ to, subject, html, text }) {
  if (!to) return { ok: false, code: "E_FIELD_MISSING", message: "Destinataire manquant." };
  const message = { to, from: senderAddress(), subject, html, text };
  // En développement uniquement, le contenu est écrit dans les logs : pratique pour tester sans domaine d'envoi.
  if (env.ENVIRONMENT === "development") console.log(`[mail:dev] à ${to} — ${subject}\n${text ?? ""}`);
  if (!env.EMAIL?.send) {
    console.error("[mail] binding EMAIL absent : e-mail non envoyé.");
    return { ok: false, code: "NO_BINDING", message: MAIL_ERROR_HINTS.NO_BINDING };
  }
  try {
    const result = await env.EMAIL.send(message);
    return { ok: true, messageId: result?.messageId };
  } catch (error) {
    const code = error?.code || "UNKNOWN";
    // Journal : visible dans Cloudflare > Worker > Observabilité (jamais le contenu du message ni le code de vérification).
    console.error(`[mail] échec d'envoi (${code}) vers ${String(to).replace(/^(.).*(@.*)$/, "$1***$2")} :`, error?.message || error);
    return { ok: false, code, message: error?.message || "Échec d'envoi." };
  }
}

// Version simple : true si le message est parti.
export async function sendMail(message) {
  return (await sendMailDetailed(message)).ok;
}
