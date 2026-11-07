import { useState } from "react";
import { Check, ChevronDown, ExternalLink, Loader2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { missingRequiredFields } from "@/lib/psp-catalog";

// Une carte par prestataire : champs d'authentification réels, mode test/live
// et choix du prestataire utilisé par défaut pour les abonnements.
export default function ProviderCard({ provider, config, onSave }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    enabled: config?.enabled || false,
    mode: config?.mode || "test",
    isDefault: config?.is_default || false,
    values: {},
  });

  const stored = config?.filled || {};
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const setValue = (key, value) =>
    setForm((f) => ({ ...f, values: { ...f.values, [key]: value } }));

  // Un champ est considéré renseigné s'il est saisi maintenant ou déjà stocké.
  const presence = Object.fromEntries(
    provider.fields.map((field) => [field.key, form.values[field.key] || stored[field.key] || ""])
  );
  const missing = missingRequiredFields(provider, presence);
  const ready = missing.length === 0;
  const filledCount = provider.fields.length - missing.length;

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    try {
      await onSave({
        provider: provider.provider,
        enabled: form.enabled,
        mode: form.mode,
        isDefault: form.isDefault,
        fields: form.values,
      });
      setOpen(false);
      setForm((f) => ({ ...f, values: {} }));
    } catch {
      // Le message est déjà remonté par la page.
    } finally {
      setBusy(false);
    }
  }

  const state = config?.enabled
    ? ready
      ? "active"
      : "incomplete"
    : Object.keys(stored).length > 0
      ? "stored"
      : "idle";

  return (
    <div
      className={cn(
        "rounded-2xl border bg-background p-5 transition-colors",
        config?.enabled ? "border-foreground/25" : "border-border"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 text-[13.5px] font-medium">
            {provider.name}
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[9.5px] font-medium uppercase tracking-[0.1em]",
                state === "active"
                  ? "bg-primary/10 text-primary"
                  : state === "incomplete"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-secondary text-foreground/50"
              )}
            >
              {state === "active"
                ? "Actif"
                : state === "incomplete"
                  ? "Incomplet"
                  : state === "stored"
                    ? "Clés enregistrées"
                    : "Non connecté"}
            </span>
            {config?.is_default && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5 text-[9.5px] font-medium uppercase tracking-[0.1em]">
                <Star className="h-2.5 w-2.5" /> Par défaut
              </span>
            )}
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            {provider.region}
          </p>
          <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{provider.hint}</p>
          <p className="mt-1.5 text-[11.5px] text-foreground/55">{provider.coverage}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex shrink-0 items-center gap-1 rounded-full border border-border px-3 py-1.5 text-[11.5px] font-medium transition-colors hover:border-foreground/30"
        >
          {open ? "Fermer" : Object.keys(stored).length ? "Modifier" : "Configurer"}
          <ChevronDown
            className={cn("h-3 w-3 transition-transform", open && "rotate-180")}
            strokeWidth={2}
          />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
        <span>
          {filledCount}/{provider.fields.length} champs requis renseignés
        </span>
        <a
          href={provider.docs}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-foreground"
        >
          Documentation <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {open && (
        <form onSubmit={submit} className="mt-4 space-y-4 border-t border-border pt-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {provider.fields.map((field) => (
              <label key={field.key} className="block">
                <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  {field.label}
                  {field.required && <span className="text-destructive"> *</span>}
                </span>
                <input
                  type={field.secret ? "password" : "text"}
                  autoComplete="off"
                  value={form.values[field.key] || ""}
                  placeholder={
                    stored[field.key] ? `Enregistré ${stored[field.key]} — laisser vide` : field.placeholder
                  }
                  onChange={(e) => setValue(field.key, e.target.value)}
                  className="mt-1.5 h-9 w-full rounded-lg border border-border bg-transparent px-3 text-[12.5px] outline-none focus-visible:border-foreground/40"
                />
                <span className="mt-1 block text-[10.5px] leading-snug text-muted-foreground">
                  {field.hint}
                </span>
              </label>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-[12px]">
              <span className="text-muted-foreground">Mode</span>
              <select
                value={form.mode}
                onChange={(e) => set("mode", e.target.value)}
                className="h-8 rounded-md border border-border bg-transparent px-2 text-[12px]"
              >
                <option value="test">Test</option>
                <option value="live">Production</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-[12px]">
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(e) => set("enabled", e.target.checked)}
                className="h-3.5 w-3.5 accent-primary"
              />
              Activer ce prestataire
            </label>
            <label className="flex items-center gap-2 text-[12px]">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) => set("isDefault", e.target.checked)}
                className="h-3.5 w-3.5 accent-primary"
              />
              Utiliser pour les abonnements
            </label>
          </div>

          {!ready && form.enabled && (
            <p className="rounded-lg bg-destructive/5 px-3 py-2 text-[11.5px] leading-relaxed text-destructive">
              Renseignez {missing.join(", ")} pour activer {provider.name}.
            </p>
          )}

          <div className="flex items-center justify-end pt-1">
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-[12px] font-medium text-background disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              Enregistrer
            </button>
          </div>
        </form>
      )}
    </div>
  );
}