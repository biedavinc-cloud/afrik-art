import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Clock, Loader2, Mail, LifeBuoy, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FaqList from "@/components/site/FaqList";
import { createSupportTicket } from "@/lib/content-fns";

export const Route = createFileRoute("/_site/support")({
  head: () => ({
    meta: [
      { title: "Aide et support | Afrik Art" },
      {
        name: "description",
        content:
          "Contactez l'équipe Afrik Art pour un problème de compte, d'abonnement, de paiement ou de fonctionnement.",
      },
    ],
  }),
  component: SupportPage,
});

const CATEGORIES = [
  { value: "compte", label: "Mon compte / connexion" },
  { value: "abonnement", label: "Abonnement" },
  { value: "paiement", label: "Paiement ou facture" },
  { value: "technique", label: "Problème technique" },
  { value: "autre", label: "Autre demande" },
];

const QUICK = [
  {
    q: "Je n'arrive pas à me connecter",
    a: "Utilisez « Mot de passe oublié » pour recevoir un lien de réinitialisation. S'il n'arrive pas, vérifiez vos spams puis écrivez-nous en précisant l'adresse email du compte.",
  },
  {
    q: "Mon abonnement est resté en attente",
    a: "Une demande d'abonnement est activée dès la confirmation du paiement. Si le statut reste « en attente » après 24 h, envoyez-nous la référence du paiement.",
  },
  {
    q: "Mes images ne s'affichent pas",
    a: "Vérifiez le format (JPG ou PNG) et le poids. Réenregistrez l'œuvre depuis Portfolio ; si le problème persiste, indiquez le titre de l'œuvre concernée.",
  },
];

function SupportPage() {
  const [form, setForm] = useState({ name: "", email: "", category: "autre", subject: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await createSupportTicket({
        data: {
          name: form.name,
          email: form.email,
          category: form.category,
          subject: form.subject || undefined,
          message: form.message,
        },
      });
      setSent(true);
      setForm({ name: "", email: "", category: "autre", subject: "", message: "" });
    } catch (err) {
      setError(err.message || "L'envoi a échoué. Réessayez.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="max-w-2xl">
        <p className="label-caps">Support</p>
        <h1 className="mt-3 text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-tight">
          Aide et support
        </h1>
        <p className="mt-4 text-[14.5px] leading-relaxed text-muted-foreground">
          Une question sur votre compte, un paiement, un problème d'affichage ? Écrivez-nous,
          une personne vous répond.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          {sent ? (
            <div className="py-10 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
              <p className="mt-4 text-[16px] font-medium">Message envoyé</p>
              <p className="mx-auto mt-2 max-w-sm text-[13px] text-muted-foreground">
                Notre équipe vous répond par email sous 24 à 48 heures ouvrées. Conservez la
                confirmation dans votre boîte.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-6 rounded-full border border-border px-5 py-2.5 text-[12.5px] font-medium"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <h2 className="text-[19px] font-semibold">Écrire à l'équipe</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="s-name">Votre nom</Label>
                  <Input id="s-name" required value={form.name} onChange={set("name")} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="s-email">Votre email</Label>
                  <Input id="s-email" type="email" required value={form.email} onChange={set("email")} className="mt-1.5" />
                </div>
              </div>

              <div>
                <Label>Motif</Label>
                <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="s-subject">Objet</Label>
                <Input id="s-subject" value={form.subject} onChange={set("subject")} className="mt-1.5" />
              </div>

              <div>
                <Label htmlFor="s-message">Message</Label>
                <Textarea
                  id="s-message"
                  required
                  minLength={10}
                  rows={6}
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Décrivez la situation, l'écran concerné et ce que vous attendiez."
                  className="mt-1.5"
                />
              </div>

              {error && <p className="text-[13px] text-destructive">{error}</p>}

              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-[13px] font-medium text-background disabled:opacity-60"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Envoyer au support
              </button>
            </form>
          )}
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="flex items-center gap-2 text-[13.5px] font-medium">
              <Clock className="h-4 w-4 text-primary" /> Délais de réponse
            </p>
            <ul className="mt-3 space-y-2 text-[13px] text-muted-foreground">
              <li>Compte et connexion — sous 24 h</li>
              <li>Paiement et abonnement — sous 48 h</li>
              <li>Problème technique — sous 48 h ouvrées</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="flex items-center gap-2 text-[13.5px] font-medium">
              <LifeBuoy className="h-4 w-4 text-primary" /> Réponses immédiates
            </p>
            <FaqList items={QUICK} className="mt-4 border-0 divide-border/70" />
          </div>

          <div className="rounded-2xl bg-foreground p-6 text-background">
            <p className="text-[13.5px] font-medium">Vous cherchez plutôt des conseils ?</p>
            <p className="mt-2 text-[12.5px] leading-relaxed text-background/70">
              Le guide artiste détaille la méthode pour construire un portfolio convaincant.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to="/guide-artiste"
                className="rounded-full bg-primary px-4 py-2 text-[12px] font-medium text-primary-foreground"
              >
                Guide artiste
              </Link>
              <Link
                to="/faq"
                className="inline-flex items-center gap-1.5 rounded-full border border-background/25 px-4 py-2 text-[12px] font-medium"
              >
                <Mail className="h-3.5 w-3.5" /> FAQ
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}