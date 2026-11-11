import { useState } from "react";
import { Flag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/api/client";
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

const REASONS = [
  { value: "contenu_inapproprie", label: "Contenu inapproprié" },
  { value: "droits_auteur", label: "Atteinte au droit d'auteur" },
  { value: "usurpation", label: "Usurpation d'identité" },
  { value: "spam", label: "Spam ou arnaque" },
  { value: "autre", label: "Autre" },
];

export default function ReportDialog({ profile }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [reason, setReason] = useState("contenu_inapproprie");
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState("");

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.entities.Report.create({
        profile_id: profile.id,
        profile_slug: profile.slug,
        reporter_email: email,
        reason,
        details,
        status: "open",
      });
      toast.success("Signalement enregistré. Merci pour votre vigilance.");
      setOpen(false);
      setDetails("");
      setEmail("");
    } catch (err) {
      toast.error(err.message || "Le signalement n'a pas pu être envoyé.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-1.5 text-[11.5px] text-muted-foreground transition-colors hover:text-foreground">
          <Flag className="h-3 w-3" /> Signaler ce profil
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Signaler ce profil</DialogTitle>
          <DialogDescription>
            L'équipe de modération examinera ce profil. Les signalements abusifs ne sont pas pris en compte.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="mt-2 space-y-4">
          <div>
            <Label>Motif</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="r-email">Votre email (optionnel)</Label>
            <Input id="r-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="r-details">Précisions</Label>
            <Textarea
              id="r-details"
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-[13px] font-medium text-background hover:bg-primary disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Envoyer le signalement
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}