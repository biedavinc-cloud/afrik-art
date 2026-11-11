import { env } from "cloudflare:workers";

// E-mails transactionnels via Cloudflare Email Service (binding `EMAIL`, aucun fournisseur externe).
// Prérequis : plan Workers payant + domaine d'envoi validé dans Cloudflare > Email Service.
const escapeHtml = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const stripTags = (html) => String(html).replace(/<style[\s\S]*?<\/style>/g, "").replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n\n").replace(/<[^>]+>/g, "").replace(/\n{3,}/g, "\n\n").trim();

export async function sendMail({ to, subject, html, text }) {
  const message = { to, from: env.MAIL_FROM || "noreply@afrik.cloud", subject, html, text: text ?? stripTags(html) };
  // Hors production, le contenu est écrit dans les logs : pratique pour tester sans domaine d'envoi.
  if (env.ENVIRONMENT === "development") console.log(`[mail:dev] à ${to} — ${subject}\n${message.text}`);
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

const shell = (title, body) => `<!doctype html><html lang="fr"><body style="margin:0;background:#f6f6f6;font-family:Arial,Helvetica,sans-serif;color:#1d1d1d">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;background:#fff;border-radius:12px;padding:32px">
<tr><td><p style="margin:0 0 20px;font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:#888">Afrik Art</p>
<h1 style="margin:0 0 16px;font-size:20px">${escapeHtml(title)}</h1>${body}
<p style="margin:28px 0 0;font-size:12px;color:#999">Si vous n'êtes pas à l'origine de cette demande, ignorez simplement ce message.</p></td></tr></table></td></tr></table></body></html>`;

export const otpEmail = (code) => ({
  subject: "Votre code de vérification Afrik Art",
  html: shell(
    "Confirmez votre adresse e-mail",
    `<p style="margin:0 0 20px;font-size:15px;line-height:1.5">Saisissez ce code pour finaliser la création de votre compte. Il est valable 15 minutes.</p>
<p style="margin:0;font-size:32px;font-weight:700;letter-spacing:.3em">${escapeHtml(code)}</p>`,
  ),
});

export const resetEmail = (link, { invited = false } = {}) => ({
  subject: invited ? "Vous êtes invité sur Afrik Art" : "Réinitialisation de votre mot de passe Afrik Art",
  html: shell(
    invited ? "Activez votre compte" : "Réinitialisez votre mot de passe",
    `<p style="margin:0 0 20px;font-size:15px;line-height:1.5">${
      invited ? "Un accès à Afrik Art a été créé pour vous. Choisissez votre mot de passe pour l'activer." : "Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe."
    } Ce lien est à usage unique.</p>
<p style="margin:0"><a href="${escapeHtml(link)}" style="display:inline-block;background:#e11d2e;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:600">Choisir mon mot de passe</a></p>
<p style="margin:16px 0 0;font-size:12px;color:#888;word-break:break-all">${escapeHtml(link)}</p>`,
  ),
});
