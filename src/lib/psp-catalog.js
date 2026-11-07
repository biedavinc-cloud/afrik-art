// Catalogue des six prestataires de paiement africains retenus pour encaisser
// les abonnements et les mises en avant. Chaque entrée décrit les champs
// d'authentification réellement exigés par l'API du prestataire.
// La clé `key` correspond à une colonne de l'entité Integration.
export const PAYMENT_PROVIDERS = [
  {
    provider: "payunit",
    name: "PayUnit",
    region: "Cameroun · Afrique centrale",
    coverage: "MTN MoMo, Orange Money, cartes bancaires",
    hint: "Passerelle camerounaise historique, encaissement Mobile Money en XAF.",
    docs: "https://developer.payunit.net",
    fields: [
      {
        key: "api_key",
        label: "Clé API (x-api-key)",
        placeholder: "live_xxxxxxxxxxxx",
        hint: "Application › API keys dans votre tableau de bord PayUnit.",
        required: true,
        secret: true,
      },
      {
        key: "public_key",
        label: "Identifiant API",
        placeholder: "api_user",
        hint: "Identifiant utilisé pour l'authentification Basic.",
        required: true,
      },
      {
        key: "secret_key",
        label: "Mot de passe API",
        placeholder: "••••••••",
        hint: "Mot de passe associé à l'identifiant API.",
        required: true,
        secret: true,
      },
    ],
  },
  {
    provider: "cinetpay",
    name: "CinetPay",
    region: "Afrique de l'Ouest francophone",
    coverage: "Orange Money, MTN, Moov, Wave, cartes",
    hint: "Couverture Côte d'Ivoire, Sénégal, Cameroun, Mali, Burkina, Guinée.",
    docs: "https://docs.cinetpay.com",
    fields: [
      {
        key: "api_key",
        label: "Clé API",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxx",
        hint: "Votre compte CinetPay › Intégrations › Clé API.",
        required: true,
        secret: true,
      },
      {
        key: "merchant_id",
        label: "Site ID",
        placeholder: "123456",
        hint: "Identifiant du site créé dans votre compte marchand.",
        required: true,
      },
    ],
  },
  {
    provider: "flutterwave",
    name: "Flutterwave",
    region: "Panafricain · 30+ pays",
    coverage: "Cartes, Mobile Money, virements, diaspora",
    hint: "Le plus large maillage du continent, bons taux de réussite sur cartes.",
    docs: "https://developer.flutterwave.com",
    fields: [
      {
        key: "public_key",
        label: "Clé publique",
        placeholder: "FLWPUBK_TEST-…",
        hint: "Dashboard › Settings › API keys.",
        required: true,
      },
      {
        key: "secret_key",
        label: "Clé secrète",
        placeholder: "FLWSECK_TEST-…",
        hint: "Nécessaire pour initialiser les paiements côté serveur.",
        required: true,
        secret: true,
      },
      {
        key: "api_key",
        label: "Secret hash (webhook)",
        placeholder: "votre_secret_hash",
        hint: "Permet de vérifier la signature des notifications de paiement.",
        required: false,
        secret: true,
      },
    ],
  },
  {
    provider: "paystack",
    name: "Paystack",
    region: "Nigeria · Afrique anglophone",
    coverage: "Cartes, transferts, USSD",
    hint: "Référence au Nigeria et au Ghana, excellente fiabilité des cartes.",
    docs: "https://paystack.com/docs/api",
    fields: [
      {
        key: "public_key",
        label: "Clé publique",
        placeholder: "pk_test_…",
        hint: "Dashboard › Settings › API Keys & Webhooks.",
        required: true,
      },
      {
        key: "secret_key",
        label: "Clé secrète",
        placeholder: "sk_test_…",
        hint: "À conserver côté serveur uniquement.",
        required: true,
        secret: true,
      },
    ],
  },
  {
    provider: "pawapay",
    name: "PawaPay",
    region: "Mobile Money · 20+ pays",
    coverage: "MTN, Airtel, Moov, Orange, Vodacom",
    hint: "Une seule API pour encaisser le Mobile Money dans toute l'Afrique.",
    docs: "https://docs.pawapay.io",
    fields: [
      {
        key: "api_key",
        label: "Jeton API",
        placeholder: "Bearer token",
        hint: "Dashboard PawaPay › API token du compte marchand.",
        required: true,
        secret: true,
      },
      {
        key: "merchant_id",
        label: "Identifiant marchand",
        placeholder: "facultatif",
        hint: "Utile si vous gérez plusieurs comptes marchands.",
        required: false,
      },
    ],
  },
  {
    provider: "mpesa",
    name: "M-Pesa (Daraja)",
    region: "Kenya · Afrique de l'Est",
    coverage: "M-Pesa STK Push, Tanzanie, RDC",
    hint: "Encaissement direct M-Pesa via l'API Daraja de Safaricom.",
    docs: "https://developer.safaricom.co.ke",
    fields: [
      {
        key: "public_key",
        label: "Consumer key",
        placeholder: "consumer key",
        hint: "Portail Daraja › My Apps › clés de l'application.",
        required: true,
      },
      {
        key: "secret_key",
        label: "Consumer secret",
        placeholder: "consumer secret",
        hint: "Seconde clé de la même application Daraja.",
        required: true,
        secret: true,
      },
      {
        key: "merchant_id",
        label: "Business shortcode",
        placeholder: "174379",
        hint: "Paybill ou Till number qui reçoit les paiements.",
        required: true,
      },
      {
        key: "api_key",
        label: "Lipa na M-Pesa passkey",
        placeholder: "passkey",
        hint: "Fournie avec le shortcode pour signer les requêtes STK.",
        required: true,
        secret: true,
      },
    ],
  },
];

export const AI_MODELS = [
  { key: "gemini-2.5-flash", label: "Gemini 2.5 Flash — rapide et économique" },
  { key: "gemini-2.5-pro", label: "Gemini 2.5 Pro — réponses les plus fines" },
  { key: "gemini-2.0-flash", label: "Gemini 2.0 Flash — usage intensif" },
];

export const PROVIDER_KEYS = PAYMENT_PROVIDERS.map((p) => p.provider);

export const providerByKey = (key) =>
  PAYMENT_PROVIDERS.find((p) => p.provider === key) || null;

export const PROVIDER_LABEL = (key) => providerByKey(key)?.name || key;

// Champs obligatoires encore vides pour un prestataire donné.
// `values` contient les valeurs déjà enregistrées et celles saisies à l'instant.
export function missingRequiredFields(provider, values = {}) {
  if (!provider) return ["Prestataire inconnu"];
  return provider.fields
    .filter((field) => field.required && !String(values[field.key] ?? "").trim())
    .map((field) => field.label);
}

export const isProviderReady = (provider, values = {}) =>
  missingRequiredFields(provider, values).length === 0;