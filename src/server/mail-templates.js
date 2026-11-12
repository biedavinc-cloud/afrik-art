import { MAIL_COPY } from "./mail-i18n";

/**
 * Modèles d'e-mails (sans dépendance serveur : fonctions pures).
 * Charte : noir #1D1D1D, rouge Afrik Art #E11D2E, police Poppins (repli Helvetica/Arial), logo en tête.
 * Tout texte venu d'un utilisateur (nom, message, e-mail) est échappé : aucun HTML ne peut être injecté.
 */

const INK = "#1D1D1D";
const RED = "#E11D2E";
const MUTED = "#666666";
const LINE = "#E6E6E6";
const SOFT = "#F7F7F7";
const FONT = "'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif";

export const esc = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Les en-têtes d'un e-mail ne doivent jamais contenir de saut de ligne.
const oneLine = (value, max = 200) => String(value ?? "").replace(/[\r\n\t]+/g, " ").trim().slice(0, max);

const fill = (template, vars = {}) => template.replace(/\{(\w+)\}/g, (_, key) => (vars[key] === undefined ? "" : String(vars[key])));

const copyFor = (lang) => MAIL_COPY[lang] || MAIL_COPY.fr;

// Lien http(s) uniquement.
const safeUrl = (url) => (/^https?:\/\//i.test(String(url)) ? String(url) : "#");

/**
 * Construit un e-mail complet { subject, html, text }.
 *   paragraphs  textes simples (échappés)
 *   code        code de vérification affiché en grand
 *   quote       message d'un utilisateur, affiché dans un encadré (échappé, retours à la ligne conservés)
 *   details     [{ label, value }] lignes de coordonnées
 *   cta         { label, url } bouton principal · secondary { label, url } lien secondaire
 *   fallbackLink  lien à copier si le bouton ne fonctionne pas
 *   notes       petites lignes de fin (durée de validité, sécurité…)
 */
export function buildEmail({ lang = "fr", baseUrl, subject, preheader, title, paragraphs = [], code, quote, details, cta, secondary, fallbackLink, fallbackNote, notes = [] }) {
  const c = copyFor(lang);
  const site = String(baseUrl || "https://afrik.cloud").replace(/\/$/, "");
  const year = new Date().getFullYear();

  const paragraphHtml = paragraphs
    .map((p) => `<p style="margin:0 0 18px;font-family:${FONT};font-size:15px;line-height:1.65;color:${INK};">${esc(p)}</p>`)
    .join("");

  const codeHtml = code
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 22px;"><tr><td align="center" style="background:${SOFT};border:1px solid ${LINE};border-radius:14px;padding:20px 12px;">
        <span class="code" style="font-family:${FONT};font-size:38px;line-height:1;font-weight:700;letter-spacing:0.32em;padding-left:0.32em;color:${INK};">${esc(code)}</span>
      </td></tr></table>`
    : "";

  const quoteHtml = quote
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 22px;"><tr>
        <td width="4" style="background:${RED};border-radius:4px;font-size:0;line-height:0;">&nbsp;</td>
        <td style="background:${SOFT};border-radius:0 12px 12px 0;padding:16px 18px;font-family:${FONT};font-size:15px;line-height:1.65;color:${INK};white-space:pre-line;">${esc(quote)}</td>
      </tr></table>`
    : "";

  const detailsHtml =
    details && details.length
      ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 22px;border:1px solid ${LINE};border-radius:12px;">${details
          .map(
            (d, i) => `<tr><td style="padding:11px 16px;${i ? `border-top:1px solid ${LINE};` : ""}font-family:${FONT};font-size:13px;color:${MUTED};width:34%;">${esc(d.label)}</td><td style="padding:11px 16px;${i ? `border-top:1px solid ${LINE};` : ""}font-family:${FONT};font-size:14px;color:${INK};word-break:break-word;">${esc(d.value)}</td></tr>`,
          )
          .join("")}</table>`
      : "";

  const ctaHtml = cta
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:6px 0 22px;"><tr><td align="center" bgcolor="${INK}" style="background:${INK};border-radius:999px;">
        <a href="${esc(safeUrl(cta.url))}" style="display:inline-block;padding:14px 30px;font-family:${FONT};font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;border-radius:999px;">${esc(cta.label)}</a>
      </td></tr></table>`
    : "";

  const secondaryHtml = secondary
    ? `<p style="margin:0 0 22px;font-family:${FONT};font-size:14px;"><a href="${esc(safeUrl(secondary.url))}" style="color:${RED};text-decoration:underline;font-weight:500;">${esc(secondary.label)}</a></p>`
    : "";

  const fallbackHtml = fallbackLink
    ? `<p style="margin:0 0 6px;font-family:${FONT};font-size:12px;line-height:1.6;color:${MUTED};">${esc(fallbackNote || "")}</p>
       <p style="margin:0 0 22px;font-family:${FONT};font-size:12px;line-height:1.6;word-break:break-all;"><a href="${esc(safeUrl(fallbackLink))}" style="color:${MUTED};">${esc(fallbackLink)}</a></p>`
    : "";

  const notesHtml = notes
    .map((n) => `<p style="margin:0 0 10px;font-family:${FONT};font-size:13px;line-height:1.6;color:${MUTED};">${esc(n)}</p>`)
    .join("");

  const html = `<!doctype html>
<html lang="${esc(lang)}" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(subject)}</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&amp;display=swap" rel="stylesheet">
<style>
  @media only screen and (max-width: 600px) {
    .card { padding: 28px 22px 26px !important; }
    .code { font-size: 30px !important; letter-spacing: 0.22em !important; padding-left: 0.22em !important; }
    .outer { padding: 16px 10px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:#F4F4F5;-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">${esc(preheader || "")}${"&nbsp;&zwnj;".repeat(40)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#F4F4F5" style="background:#F4F4F5;">
<tr><td align="center" class="outer" style="padding:32px 16px;">
  <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;">
    <tr><td class="card" bgcolor="#FFFFFF" style="background:#FFFFFF;border:1px solid ${LINE};border-radius:20px;padding:36px 40px 32px;">

      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 26px;"><tr>
        <td valign="middle" style="padding-right:12px;"><a href="${esc(site)}" style="text-decoration:none;"><img src="${esc(site)}/email-logo.png" width="44" height="44" alt="Afrik Art" style="display:block;border:0;width:44px;height:44px;"></a></td>
        <td valign="middle">
          <div style="font-family:${FONT};font-size:18px;font-weight:600;letter-spacing:-0.01em;color:${INK};line-height:1.2;">Afrik Art</div>
          <div style="font-family:${FONT};font-size:10.5px;letter-spacing:0.22em;text-transform:uppercase;color:${MUTED};line-height:1.6;">${esc(c.tagline)}</div>
        </td>
      </tr></table>

      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;"><tr><td width="40" height="4" bgcolor="${RED}" style="background:${RED};border-radius:4px;font-size:0;line-height:0;">&nbsp;</td></tr></table>

      <h1 style="margin:0 0 16px;font-family:${FONT};font-size:24px;line-height:1.3;font-weight:600;letter-spacing:-0.01em;color:${INK};">${esc(title)}</h1>
      ${paragraphHtml}${codeHtml}${quoteHtml}${detailsHtml}${ctaHtml}${secondaryHtml}${fallbackHtml}
      ${notesHtml ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:6px;border-top:1px solid ${LINE};"><tr><td style="padding-top:18px;">${notesHtml}</td></tr></table>` : ""}
    </td></tr>

    <tr><td align="center" style="padding:22px 12px 0;">
      <p style="margin:0 0 6px;font-family:${FONT};font-size:12.5px;line-height:1.6;color:${INK};font-weight:500;">${esc(c.footerAbout)}</p>
      <p style="margin:0 0 6px;font-family:${FONT};font-size:12px;line-height:1.6;color:${MUTED};">${esc(c.footerSecurity)}</p>
      <p style="margin:0 0 10px;font-family:${FONT};font-size:12px;line-height:1.6;color:${MUTED};">${esc(c.footerAuto)}</p>
      <p style="margin:0;font-family:${FONT};font-size:11.5px;color:#9A9A9A;">© ${year} Afrik Art · <a href="${esc(site)}" style="color:#9A9A9A;">${esc(site.replace(/^https?:\/\//, ""))}</a></p>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;

  // Version texte brut (clients sans HTML, lecteurs d'écran, filtres anti-spam).
  const text = [
    "AFRIK ART — " + c.tagline.toUpperCase(),
    "",
    title,
    "",
    ...paragraphs.flatMap((p) => [p, ""]),
    ...(code ? [code, ""] : []),
    ...(quote ? [quote.split("\n").map((l) => "> " + l).join("\n"), ""] : []),
    ...(details || []).map((d) => `${d.label} : ${d.value}`),
    ...(details && details.length ? [""] : []),
    ...(cta ? [`${cta.label} : ${cta.url}`, ""] : []),
    ...(secondary ? [`${secondary.label} : ${secondary.url}`, ""] : []),
    ...notes.flatMap((n) => [n]),
    "",
    "—",
    c.footerAbout,
    c.footerSecurity,
    site,
  ]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { subject: oneLine(subject), html, text };
}

// ---------- Modèles ----------

export function otpEmail({ lang, baseUrl, code }) {
  const t = copyFor(lang).otp;
  return buildEmail({
    lang,
    baseUrl,
    subject: t.subject,
    preheader: fill(t.preheader, { code }),
    title: t.title,
    paragraphs: [t.intro],
    code,
    notes: [t.expires, t.ignore],
  });
}

export function resetEmail({ lang, baseUrl, link, invited = false }) {
  const t = copyFor(lang)[invited ? "invite" : "reset"];
  return buildEmail({
    lang,
    baseUrl,
    subject: t.subject,
    preheader: t.preheader,
    title: t.title,
    paragraphs: [t.intro],
    cta: { label: t.cta, url: link },
    fallbackLink: link,
    fallbackNote: t.linkNote,
    notes: [t.expires, t.ignore],
  });
}

export function accountExistsEmail({ lang, baseUrl }) {
  const t = copyFor(lang).exists;
  const site = String(baseUrl || "https://afrik.cloud").replace(/\/$/, "");
  return buildEmail({
    lang,
    baseUrl,
    subject: t.subject,
    preheader: t.preheader,
    title: t.title,
    paragraphs: [t.intro],
    cta: { label: t.cta, url: `${site}/login` },
    secondary: { label: t.cta2, url: `${site}/forgot-password` },
    notes: [t.ignore],
  });
}

// Nouveau message d'un client, destiné à l'artiste.
export function contactNotificationEmail({ lang, baseUrl, clientName, message, clientEmail, clientPhone }) {
  const t = copyFor(lang).notify;
  const site = String(baseUrl || "https://afrik.cloud").replace(/\/$/, "");
  const name = oneLine(clientName, 80) || "—";
  const details = [{ label: t.email, value: clientEmail }, ...(clientPhone ? [{ label: t.phone, value: clientPhone }] : [])];
  return buildEmail({
    lang,
    baseUrl,
    subject: fill(t.subject, { name }),
    preheader: fill(t.preheader, { name }),
    title: t.title,
    paragraphs: [fill(t.intro, { name })],
    quote: message,
    cta: { label: t.cta, url: `${site}/messagerie` },
    details: clientEmail ? details : undefined,
    notes: [t.hint],
  });
}

// Réponse d'un artiste, destinée au client.
export function replyEmail({ lang, baseUrl, artistName, message, profileUrl }) {
  const t = copyFor(lang).reply;
  const artist = oneLine(artistName, 80) || "Afrik Art";
  return buildEmail({
    lang,
    baseUrl,
    subject: fill(t.subject, { artist }),
    preheader: fill(t.preheader, { artist }),
    title: fill(t.title, { artist }),
    paragraphs: [t.intro],
    quote: message,
    cta: profileUrl ? { label: t.cta, url: profileUrl } : undefined,
  });
}
