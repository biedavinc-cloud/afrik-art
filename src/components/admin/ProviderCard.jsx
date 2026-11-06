import { useState } from "react";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Une carte par prestataire de paiement, avec un formulaire de connexion replié.
export default function ProviderCard({ provider, config, onSave }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    enabled: config?.enabled || false,
    mode: config?.mode || "test",
    publicKey: config?.public_key || "",
    merchantId: config?.merchant_id || "",
    secretKey: "",
  });

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const needs = (field) => provider.fields.includes(field);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await onSave({
        provider: provider.provider,
        displayName: provider.name,
        enabled: form.enabled,
        mode: form.mode,
        publicKey: form.publicKey,
        merchantId: form.merchantId,
        secretKey: form.secretKey || undefined,
      });
      setOpen(false);
      setForm((f) => ({ ...f, secretKey: "" }));
    } catch (error) {
      // Le message est déjà remonté par le tableau de bord.
    } finally {
      setBusy(false);
    }
  }

  const connected = config?.enabled;

  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[13.5px] font-medium">
            {provider.name}
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[9.5px] font-medium uppercase tracking-[0.1em]",
                connected ? "bg-primary/10 text-primary" : "bg-secondary text-foreground/50"
              )}
            >
              {connected ? "Actif" : config?.has_secret ? "Clé enregistrée" : "Non connecté"}
            </span>
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            {provider.region}
          </p>
          <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{provider.hint}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex shrink-0 items-center gap-1 rounded-full border border-border px-3 py-1.5 text-[11.5px] font-medium transition-colors hover:border-foreground/30"
        >
          Configurer
          <ChevronDown
            className={cn("h-3 w-3 transition-transform", open && "rotate-180")}
            strokeWidth={2}
          />
        </button>
      </div>

      {config?.has_secret && (
        <p className="mt-3 text-[11px] text-muted-foreground">
          Clé enregistrée : {config.secret_hint} · mode {config.mode}
        </p>
      )}

      {open && (
        <form onSubmit={submit} className="mt-4 space-y-3 border-t border-border pt-4">
          {needs("public_key") && (
            <Field
              label="Clé publique / client ID"
              value={form.publicKey}
              onChange={(v) => set("publicKey", v)}
            />
          )}
          {needs("merchant_id") && (
            <Field
              label="Identifiant marchand / site"
              value={form.merchantId}
              onChange={(v) => set("merchantId", v)}
            />
          )}
          {needs("secret_key") && (
            <Field
              label="Clé secrète / API"
              type="password"
              placeholder={config?.has_secret ? "Laisser vide pour conserver" : ""}
              value={form.secretKey}
              onChange={(v) => set("secretKey", v)}
            />
          )}

          <div className="flex flex-wrap items-center gap-3">
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
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <a
              href={provider.docs}
              target="_blank"
              rel="noreferrer"
              className="text-[11.5px] text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Documentation
            </a>
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

function Field({ label, value, onChange, type = "text", placeholder }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 h-9 w-full rounded-lg border border-border bg-transparent px-3 text-[12.5px] outline-none focus-visible:border-foreground/40"
      />
    </label>
  );
}