import { env } from "cloudflare:workers";
import { googleConfigured } from "./auth.server";
import { publicUrl } from "./config.server";
import { MAIL_ERROR_HINTS, senderAddress, sendMailDetailed } from "./mail.server";
import { buildEmail } from "./mail-templates";
import { ensureSchema } from "./schema.server";
import { superadminEmails } from "./users.server";

// État de la plateforme pour l'espace superadmin. Aucune valeur secrète : uniquement des « ok / manquant » et des comptages.
export async function systemStatus() {
  let database = "ok";
  try {
    await ensureSchema();
    await env.DB.prepare("SELECT 1").first();
  } catch {
    database = "error";
  }
  return {
    database,
    storage: env.FILES ? "ok" : "missing",
    emailBinding: env.EMAIL ? "ok" : "missing",
    superadmins: superadminEmails().size,
    google: googleConfigured(),
    publicUrl: publicUrl(),
    sender: senderAddress().email,
    environment: env.ENVIRONMENT || "—",
  };
}

// Envoie un e-mail de test et renvoie le résultat EXACT (code d'erreur Cloudflare + explication en français).
export async function sendTestEmail(to) {
  const mail = buildEmail({
    lang: "fr",
    baseUrl: publicUrl(),
    subject: "Test d'envoi Afrik Art",
    preheader: "Si vous lisez ceci, l'envoi d'e-mails fonctionne.",
    title: "L'envoi d'e-mails fonctionne",
    paragraphs: ["Ce message de test confirme que la plateforme peut envoyer des e-mails (codes de vérification, réinitialisation de mot de passe, notifications)."],
    notes: ["Message envoyé depuis l'espace superadmin."],
  });
  const result = await sendMailDetailed({ to, ...mail });
  return { ...result, to, hint: result.ok ? null : MAIL_ERROR_HINTS[result.code] || null };
}
