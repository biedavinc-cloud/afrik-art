import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";
import { AI_MODELS, missingRequiredFields, providerByKey } from "@/lib/psp-catalog";

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
    const svc = context.getApi().asServiceRole;
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
          is_default: Boolean(p.is_default),
          // Les valeurs restent côté serveur : on ne renvoie que leur présence
          // et leurs quatre derniers caractères.
          filled: Object.fromEntries(
            ["api_key", "public_key", "secret_key", "merchant_id"]
              .filter((key) => p[key])
              .map((key) => [key, tail(p[key])])
          ),
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
    const svc = context.getApi().asServiceRole;
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

const CREDENTIAL_FIELDS = ["api_key", "public_key", "secret_key", "merchant_id"];

export const savePaymentIntegration = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({
      provider: z.string().min(2).max(40),
      enabled: z.boolean(),
      mode: z.enum(["test", "live"]),
      isDefault: z.boolean().optional(),
      fields: z
        .object({
          api_key: z.string().max(300).optional(),
          public_key: z.string().max(300).optional(),
          secret_key: z.string().max(300).optional(),
          merchant_id: z.string().max(120).optional(),
        })
        .optional(),
    })
  )
  .handler(async ({ data, context }) => {
    assertAdmin(context.user);
    const svc = context.getApi().asServiceRole;

    const provider = providerByKey(data.provider);
    if (!provider) {
      const error = new Error("Prestataire de paiement inconnu.");
      error.status = 400;
      throw error;
    }

    const existing = await findIntegration(svc, "payment", data.provider);

    // Fusion des valeurs déjà enregistrées et de celles saisies à l'instant,
    // afin de vérifier que tous les champs obligatoires sont bien présents.
    const typed = Object.fromEntries(
      CREDENTIAL_FIELDS.map((key) => [key, (data.fields?.[key] || "").trim()])
    );
    const merged = Object.fromEntries(
      CREDENTIAL_FIELDS.map((key) => [key, typed[key] || existing?.[key] || ""])
    );

    const missing = missingRequiredFields(provider, merged);
    if (data.enabled && missing.length > 0) {
      const error = new Error(`Champs obligatoires manquants : ${missing.join(", ")}.`);
      error.status = 400;
      throw error;
    }

    const patch = {
      kind: "payment",
      provider: provider.provider,
      display_name: provider.name,
      enabled: data.enabled,
      mode: data.mode,
    };
    CREDENTIAL_FIELDS.forEach((key) => {
      if (typed[key]) patch[key] = typed[key];
    });

    const isDefault = Boolean(data.isDefault ?? existing?.is_default);
    if (isDefault && !data.enabled) {
      const error = new Error("Activez le prestataire avant d'en faire le prestataire par défaut.");
      error.status = 400;
      throw error;
    }

    if (isDefault) {
      await svc.entities.Integration.updateMany(
        { kind: "payment" },
        { $set: { is_default: false } }
      );
    }
    patch.is_default = isDefault;
    patch.sort = isDefault ? 0 : 1;

    if (existing) await svc.entities.Integration.update(existing.id, patch);
    else await svc.entities.Integration.create(patch);

    return { ok: true, is_default: isDefault };
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
    const svc = context.getApi().asServiceRole;
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