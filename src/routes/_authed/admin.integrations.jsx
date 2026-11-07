import { useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { CreditCard, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import {
  getIntegrations,
  saveAiIntegration,
  savePaymentIntegration,
} from "@/lib/platform-fns";
import { AI_MODELS, PAYMENT_PROVIDERS, PROVIDER_LABEL } from "@/lib/psp-catalog";
import ProviderCard from "@/components/admin/ProviderCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/admin/integrations")({
  loader: () => getIntegrations(),
  head: () => ({ meta: [{ title: "Superadmin · Connecteurs | Afrik Art" }] }),
  component: IntegrationsPage,
});

function IntegrationsPage() {
  const { ai, payments } = Route.useLoaderData();
  const router = useRouter();
  const saveAi = useServerFn(saveAiIntegration);
  const saveProvider = useServerFn(savePaymentIntegration);

  const [aiForm, setAiForm] = useState({
    apiKey: "",
    model: ai.model,
    enabled: ai.enabled,
  });
  const [busy, setBusy] = useState(false);

  async function submitAi(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await saveAi({
        data: {
          apiKey: aiForm.apiKey || undefined,
          model: aiForm.model,
          enabled: aiForm.enabled,
        },
      });
      toast.success("Assistant IA mis à jour.");
      setAiForm((f) => ({ ...f, apiKey: "" }));
      router.invalidate();
    } catch (error) {
      toast.error(error?.message || "Enregistrement impossible.");
    } finally {
      setBusy(false);
    }
  }

  async function submitProvider(payload) {
    try {
      await saveProvider({ data: payload });
      toast.success("Prestataire enregistré.");
      router.invalidate();
    } catch (error) {
      toast.error(error?.message || "Enregistrement impossible.");
      throw error;
    }
  }

  const connected = payments.filter((p) => p.enabled).length;
  const defaultConfig = payments.find((p) => p.enabled && p.is_default);
  const defaultProvider = defaultConfig ? PROVIDER_LABEL(defaultConfig.provider) : "";

  return (
    <div className="space-y-10">
      <div>
        <p className="label-caps">Superadmin</p>
        <h1 className="mt-2 font-heading text-[clamp(1.6rem,3vw,2.1rem)] font-semibold tracking-tight">
          Connecteurs
        </h1>
        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">
          Reliez l'assistant IA et vos prestataires de paiement. Les clés sont conservées côté
          serveur et ne sont jamais renvoyées en clair au navigateur.
        </p>
      </div>

      <section className="rounded-2xl border border-border bg-background p-6 lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background">
              <Sparkles className="h-4 w-4 text-accent" />
            </span>
            <div>
              <p className="text-[14px] font-medium">Assistant IA — Google Gemini</p>
              <p className="mt-1 text-[12.5px] text-muted-foreground">
                Alimente l'assistant du site et de votre espace. Clé disponible sur Google AI
                Studio.
              </p>
            </div>
          </div>
          <span
            className={
              ai.enabled && ai.has_key
                ? "rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em] text-primary"
                : "rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em] text-foreground/50"
            }
          >
            {ai.enabled && ai.has_key ? "Connecté" : "Non configuré"}
          </span>
        </div>

        <form onSubmit={submitAi} className="mt-6 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              Clé API Gemini
            </span>
            <input
              type="password"
              value={aiForm.apiKey}
              onChange={(e) => setAiForm((f) => ({ ...f, apiKey: e.target.value }))}
              placeholder={ai.has_key ? `Clé enregistrée ${ai.key_hint} — laisser vide pour conserver` : "AIza…"}
              className="mt-1.5 h-10 w-full rounded-lg border border-border bg-transparent px-3 text-[13px] outline-none focus-visible:border-foreground/40"
            />
          </label>

          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              Modèle
            </span>
            <select
              value={aiForm.model}
              onChange={(e) => setAiForm((f) => ({ ...f, model: e.target.value }))}
              className="mt-1.5 h-10 w-full rounded-lg border border-border bg-transparent px-3 text-[13px]"
            >
              {AI_MODELS.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end justify-between gap-4">
            <label className="flex items-center gap-2 text-[12.5px]">
              <input
                type="checkbox"
                checked={aiForm.enabled}
                onChange={(e) => setAiForm((f) => ({ ...f, enabled: e.target.checked }))}
                className="h-3.5 w-3.5 accent-primary"
              />
              Activer l'assistant
            </label>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[12.5px] font-medium text-background disabled:opacity-60"
            >
              {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Enregistrer
            </button>
          </div>
        </form>
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border">
              <CreditCard className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[14px] font-medium">Prestataires de paiement</p>
              <p className="text-[12.5px] text-muted-foreground">
                {connected} actif{connected > 1 ? "s" : ""} sur {PAYMENT_PROVIDERS.length} · Mobile
                Money et cartes africaines
              </p>
            </div>
          </div>
          <p className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" /> Clés conservées côté serveur
          </p>
        </div>

        <p
          className={cn(
            "mt-4 rounded-xl px-4 py-3 text-[12px] leading-relaxed",
            defaultProvider
              ? "bg-secondary/50 text-foreground/70"
              : "bg-accent/10 text-foreground/80"
          )}
        >
          {defaultProvider
            ? `Les abonnements et mises en avant sont rattachés à ${defaultProvider}. Les clés saisies ici servent au règlement Mobile Money ou carte de ce prestataire.`
            : "Aucun prestataire par défaut : les demandes d'abonnement restent traitées manuellement. Configurez les clés d'un prestataire, activez-le, puis cochez « Utiliser pour les abonnements »."}
        </p>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {PAYMENT_PROVIDERS.map((provider) => (
            <ProviderCard
              key={provider.provider}
              provider={provider}
              config={payments.find((p) => p.provider === provider.provider)}
              onSave={submitProvider}
            />
          ))}
        </div>
      </section>
    </div>
  );
}