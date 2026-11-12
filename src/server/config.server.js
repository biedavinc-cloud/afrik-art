import { env } from "cloudflare:workers";

// Adresse publique du site (liens et images des e-mails, URL absolues).
export const publicUrl = () => String(env.PUBLIC_URL || "https://afrik.cloud").replace(/\/$/, "");
