import { env } from "cloudflare:workers";

// Envoi d'e-mails transactionnels via Cloudflare Email Service (binding `EMAIL`, aucun fournisseur externe).
// Prérequis : plan Workers payant + domaine d'envoi validé dans Cloudflare > Email Service.
// Les modèles (mise en page, textes, langues) sont dans mail-templates.js.
export async function sendMail({ to, subject, html, text }) {
  if (!to) return false;
  const message = { to, from: env.MAIL_FROM || "noreply@afrik.cloud", subject, html, text };
  // En développement uniquement, le contenu est écrit dans les logs : pratique pour tester sans domaine d'envoi.
  if (env.ENVIRONMENT === "development") console.log(`[mail:dev] à ${to} — ${subject}\n${text ?? ""}`);
  if (!env.EMAIL?.send) {
    console.warn("[mail] binding EMAIL absent : e-mail non envoyé.");
    return false;
  }
  try {
    await env.EMAIL.send(message);
    return true;
  } catch (error) {
    console.error("[mail] échec d'envoi:", error?.message || error);
    return false;
  }
}
