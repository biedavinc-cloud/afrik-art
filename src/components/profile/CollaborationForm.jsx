import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
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
import { startConversation } from "@/lib/messaging-fns";

const TYPES = [
  { value: "collaboration", label: "Collaboration artistique" },
  { value: "exposition", label: "Exposition / programmation" },
  { value: "achat", label: "Achat d'œuvre" },
  { value: "commande", label: "Commande / prestation" },
  { value: "presse", label: "Presse / média" },
  { value: "autre", label: "Autre demande" },
];

const EMPTY = {
  senderName: "",
  senderEmail: "",
  senderPhone: "",
  collaborationType: "collaboration",
  subject: "",
  message: "",
};

export default function CollaborationForm({ profile, source = "contact_page" }) {
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await startConversation({
        data: {
          profileId: profile.id,
          senderName: form.senderName,
          senderEmail: form.senderEmail,
          senderPhone: form.senderPhone || undefined,
          subject: form.subject || undefined,
          message: form.message,
          collaborationType: form.collaborationType,
          source,
        },
      });
      setSent(true);
      setForm(EMPTY);
    } catch (err) {
      setError(err.message || "L'envoi a échoué. Réessayez.");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
        <p className="mt-4 text-[16px] font-medium">Demande transmise à {profile.display_name}</p>
        <p className="mx-auto mt-2 max-w-sm text-[13px] text-muted-foreground">
          Elle apparaît immédiatement dans la messagerie de l'artiste, qui reçoit aussi un email.
          Vous serez recontacté à l'adresse indiquée.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-6 rounded-full border border-border px-5 py-2.5 text-[12.5px] font-medium"
        >
          Envoyer une autre demande
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-6 sm:p-7">
      <div>
        <p className="text-[15.5px] font-semibold">Demande de collaboration</p>
        <p className="mt-1 text-[12.5px] text-muted-foreground">
          Plus votre brief est précis, plus la réponse sera rapide.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="cc-name">Votre nom</Label>
          <Input id="cc-name" required value={form.senderName} onChange={set("senderName")} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="cc-email">Votre email</Label>
          <Input id="cc-email" type="email" required value={form.senderEmail} onChange={set("senderEmail")} className="mt-1.5" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="cc-phone">Téléphone / WhatsApp</Label>
          <Input id="cc-phone" value={form.senderPhone} onChange={set("senderPhone")} className="mt-1.5" />
        </div>
        <div>
          <Label>Type de projet</Label>
          <Select
            value={form.collaborationType}
            onValueChange={(v) => setForm((f) => ({ ...f, collaborationType: v }))}
          >
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="cc-subject">Objet</Label>
        <Input id="cc-subject" value={form.subject} onChange={set("subject")} className="mt-1.5" />
      </div>

      <div>
        <Label htmlFor="cc-message">Votre projet</Label>
        <Textarea
          id="cc-message"
          required
          minLength={15}
          rows={6}
          value={form.message}
          onChange={set("message")}
          placeholder="Contexte, dates, budget, usage des images…"
          className="mt-1.5"
        />
      </div>

      {error && <p className="text-[13px] text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-[13px] font-medium text-background transition-colors hover:bg-primary disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Envoyer la demande
      </button>
    </form>
  );
}