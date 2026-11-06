import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { sendContactRequest } from "@/lib/server-fns";

const TYPES = [
  { value: "collaboration", label: "Collaboration artistique" },
  { value: "exposition", label: "Exposition / programmation" },
  { value: "achat", label: "Achat d'œuvre" },
  { value: "commande", label: "Commande / prestation" },
  { value: "presse", label: "Presse / média" },
  { value: "autre", label: "Autre demande" },
];

export default function ContactDialog({ profile, children }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    senderName: "",
    senderEmail: "",
    collaborationType: "collaboration",
    subject: "",
    message: "",
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await sendContactRequest({
        data: {
          profileId: profile.id,
          senderName: form.senderName,
          senderEmail: form.senderEmail,
          subject: form.subject || "Nouvelle demande de contact",
          message: form.message,
          collaborationType: form.collaborationType,
        },
      });
      toast.success("Votre message a été transmis à l'artiste.");
      setOpen(false);
      setForm({
        senderName: "",
        senderEmail: "",
        collaborationType: "collaboration",
        subject: "",
        message: "",
      });
    } catch (err) {
      setError(err.message || "L'envoi a échoué. Réessayez.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading">Contacter {profile.display_name}</DialogTitle>
          <DialogDescription>
            Votre message est transmis directement à l'artiste. Aucun intermédiaire.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="mt-2 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="c-name">Votre nom</Label>
              <Input id="c-name" required value={form.senderName} onChange={set("senderName")} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="c-email">Votre email</Label>
              <Input
                id="c-email"
                type="email"
                required
                value={form.senderEmail}
                onChange={set("senderEmail")}
                className="mt-1.5"
              />
            </div>
          </div>

          <div>
            <Label>Type de demande</Label>
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

          <div>
            <Label htmlFor="c-subject">Objet</Label>
            <Input
              id="c-subject"
              value={form.subject}
              onChange={set("subject")}
              placeholder="Exposition collective à Dakar"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="c-message">Message</Label>
            <Textarea
              id="c-message"
              required
              minLength={15}
              rows={5}
              value={form.message}
              onChange={set("message")}
              placeholder="Présentez votre projet, vos dates et votre budget."
              className="mt-1.5"
            />
          </div>

          {error && <p className="text-[13px] text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-[13.5px] font-medium text-background transition-colors hover:bg-primary disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Envoyer la demande
          </button>
          <p className="text-center text-[11px] text-muted-foreground">
            Les demandes abusives peuvent entraîner le blocage de l'expéditeur.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}