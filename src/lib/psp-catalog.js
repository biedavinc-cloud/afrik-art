// Catalogue des prestataires de paiement préparés pour la plateforme.
// La clé `provider` est l'identifiant stocké en base (entité Integration).
export const PAYMENT_PROVIDERS = [
  {
    provider: "payunit",
    name: "PayUnit",
    region: "Cameroun · Afrique centrale",
    hint: "Mobile Money et cartes — API key + mot de passe marchand.",
    docs: "https://payunit.net",
    fields: ["api_key", "public_key", "secret_key"],
  },
  {
    provider: "cinetpay",
    name: "CinetPay",
    region: "Afrique de l'Ouest",
    hint: "Orange Money, MTN, Moov et cartes — site ID + clé API.",
    docs: "https://cinetpay.com",
    fields: ["merchant_id", "api_key"],
  },
  {
    provider: "flutterwave",
    name: "Flutterwave",
    region: "Panafricain",
    hint: "Cartes, Mobile Money et virements sur plus de 30 pays.",
    docs: "https://flutterwave.com",
    fields: ["public_key", "secret_key"],
  },
  {
    provider: "paystack",
    name: "Paystack",
    region: "Afrique anglophone",
    hint: "Cartes et transferts — clés publique et secrète.",
    docs: "https://paystack.com",
    fields: ["public_key", "secret_key"],
  },
  {
    provider: "paddle",
    name: "Paddle",
    region: "International",
    hint: "Abonnements et TVA gérée pour les ventes mondiales.",
    docs: "https://paddle.com",
    fields: ["api_key", "merchant_id"],
  },
  {
    provider: "paypal",
    name: "PayPal",
    region: "International",
    hint: "Paiements internationaux et cartes — client ID + secret.",
    docs: "https://developer.paypal.com",
    fields: ["public_key", "secret_key"],
  },
  {
    provider: "kkiapay",
    name: "Kkiapay",
    region: "Bénin · Côte d'Ivoire",
    hint: "Mobile Money et cartes — clé publique + clé privée.",
    docs: "https://kkiapay.me",
    fields: ["public_key", "secret_key"],
  },
  {
    provider: "monetbil",
    name: "Monetbil",
    region: "Afrique centrale",
    hint: "MTN, Orange et cartes — clé de service + secret.",
    docs: "https://monetbil.com",
    fields: ["api_key", "secret_key"],
  },
  {
    provider: "mtn_momo",
    name: "MTN Mobile Money",
    region: "Afrique subsaharienne",
    hint: "Encaissement direct MTN MoMo — identifiant abonné + clé API.",
    docs: "https://momodeveloper.mtn.com",
    fields: ["merchant_id", "api_key"],
  },
  {
    provider: "orange_money",
    name: "Orange Money",
    region: "Afrique de l'Ouest et centrale",
    hint: "Encaissement direct Orange Money — identifiant marchand + clé.",
    docs: "https://developer.orange.com",
    fields: ["merchant_id", "api_key"],
  },
];

export const AI_MODELS = [
  { key: "gemini-2.5-flash", label: "Gemini 2.5 Flash — rapide et économique" },
  { key: "gemini-2.5-pro", label: "Gemini 2.5 Pro — réponses les plus fines" },
  { key: "gemini-2.0-flash", label: "Gemini 2.0 Flash — usage intensif" },
];

export const PROVIDER_LABEL = (key) =>
  PAYMENT_PROVIDERS.find((p) => p.provider === key)?.name || key;