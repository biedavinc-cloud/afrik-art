import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";
import { AI_MODELS } from "@/lib/psp-catalog";

const DEFAULT_MODEL = AI_MODELS[0].key;

function assertAdmin(user) {
  if (!user || user.role !== "admin") {
    const error = new Error("Accès réservé à l'administration.");
    error.status = 403;
    throw error;
  }
}

const asPage = (res) => (Array.isArray(res) ? res : res?.items || []);

// Les clés ne quittent jamais le serveur en clair : seule la fin est renvoyée.
const tail = (value) => (value ? `•••• ${String(value).slice(-4)}` : "");

async function findIntegration(svc, kind, provider) {
  const rows = await svc.entities.Integration.filter({ kind, provider }, { limit: 1 });
  return asPage(rows)[0] || null;
}

export const getIntegrations = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    assertAdmin(context.user);
    const svc = context.getBase44().asServiceRole;
    const items = asPage(await svc.entities.Integration.list({ limit: 100 }));

    const ai = items.find((i) => i.kind === "ai");
    return {
      ai: {
        model: ai?.model || DEFAULT_MODEL,
        enabled: Boolean(ai?.enabled),
        has_key: Boolean(ai?.api_key),
        key_hint: tail(ai?.api_key),
      },
      payments: items
        .filter((i) => i.kind === "payment")
        .map((p) => ({
          provider: p.provider,
          enabled: Boolean(p.enabled),
          mode: p.mode || "test",
          has_secret: Boolean(p.secret_key || p.api_key),
          secret_hint: tail(p.secret_key || p.api_key),
          public_key: p.public_key || "",
          merchant_id: p.merchant_id || "",
        })),
    };
  });

export const saveAiIntegration = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({
      apiKey: z.string().max(300).optional(),
      model: z.string().max(60),
      enabled: z.boolean(),
    })
  )
  .handler(async ({ data, context }) => {
    assertAdmin(context.user);
    const svc = context.getBase44().asServiceRole;
    const existing = await findIntegration(svc, "ai", "gemini");

    const patch = {
      kind: "ai",
      provider: "gemini",
      display_name: "Google Gemini",
      model: data.model,
      enabled: data.enabled,
    };
    if (data.apiKey) patch.api_key = data.apiKey;

    if (existing) await svc.entities.Integration.update(existing.id, patch);
    else await svc.entities.Integration.create(patch);

    return { ok: true };
  });

export const savePaymentIntegration = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({
      provider: z.string().min(2).max(40),
      displayName: z.string().max(60),
      enabled: z.boolean(),
      mode: z.enum(["test", "live"]),
      publicKey: z.string().max(300).optional(),
      secretKey: z.string().max(300).optional(),
      merchantId: z.string().max(120).optional(),
    })
  )
  .handler(async ({ data, context }) => {
    assertAdmin(context.user);
    const svc = context.getBase44().asServiceRole;
    const existing = await findIntegration(svc, "payment", data.provider);

    const patch = {
      kind: "payment",
      provider: data.provider,
      display_name: data.displayName,
      enabled: data.enabled,
      mode: data.mode,
      public_key: data.publicKey || "",
      merchant_id: data.merchantId || "",
    };
    if (data.secretKey) {
      patch.secret_key = data.secretKey;
      patch.api_key = data.secretKey;
    }

    if (existing) await svc.entities.Integration.update(existing.id, patch);
    else await svc.entities.Integration.create(patch);

    return { ok: true };
  });

const SYSTEM_PROMPT = `Tu es l'assistant officiel d'Afrik Art, la plateforme panafricaine de promotion des artistes et créateurs africains.
Tu aides les visiteurs et les artistes : créer et optimiser un portfolio, choisir une formule (Starter gratuite, Pro 9 $/mois, Premium 29 $/mois), demander une mise en avant, gérer les messages clients, publier dans le journal, contacter le support.
Tu réponds dans la langue de la question, avec des phrases courtes, un ton chaleureux et professionnel. Tu ne promets jamais de délai, de revenu ou de partenariat, tu n'inventes ni prix ni fonctionnalité, et tu diriges vers les pages concernées de la plateforme quand c'est utile.`;

export const askAssistant = createServerFn({ method: "POST" })
  .validator(
    z.object({
      message: z.string().min(1).max(600),
      page: z.string().max(120).optional(),
      history: z
        .array(
          z.object({
            role: z.enum(["user", "model"]),
            content: z.string().max(600),
          })
        )
        .max(6)
        .optional(),
    })
  )
  .handler(async ({ data, context }) => {
    const svc = context.getBase44().asServiceRole;
    const config = await findIntegration(svc, "ai", "gemini");

    if (!config?.enabled || !config?.api_key) {
      return {
        configured: false,
        answer:
          "L'assistant n'est pas encore activé. Un administrateur peut le connecter depuis l'espace Superadmin, onglet Connecteurs.",
      };
    }

    const model = config.model || DEFAULT_MODEL;
    const contents = [
      ...(data.history || []).map((h) => ({
        role: h.role,
        parts: [{ text: h.content }],
      })),
      {
        role: "user",
        parts: [
          {
            text: data.page
              ? `${data.message}\n\n(Page consultée : ${data.page})`
              : data.message,
          },
        ],
      },
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-goog-api-key": config.api_key,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { temperature: 0.6, maxOutputTokens: 700 },
        }),
      }
    );

    if (!response.ok) {
      return {
        configured: true,
        answer:
          "L'assistant est momentanément indisponible. Vérifiez la clé Gemini dans l'espace Superadmin, ou réessayez dans un instant.",
      };
    }

    const payload = await response.json();
    const answer = (payload?.candidates?.[0]?.content?.parts || [])
      .map((part) => part.text || "")
      .join("\n")
      .trim();

    return {
      configured: true,
      answer: answer || "Je n'ai pas de réponse à cette question pour l'instant.",
    };
  });