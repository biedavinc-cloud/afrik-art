import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bell,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageCircle,
  Save,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setProfilePublished } from "@/lib/messaging-fns";
import { useAuth } from "@/lib/AuthContext";

export const Route = createFileRoute("/_authed/_app/parametres")({
  head: () => ({ meta: [{ title: "Paramètres | Afrik Art" }] }),
  component: SettingsPage,
});

const asItems = (res) => (Array.isArray(res) ? res : res?.items || []);

function SettingsPage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [togglingPublish, setTogglingPublish] = useState(false);

  useEffect(() => {
    if (!user) return;
    base44.entities.ArtistProfile.filter({ user_id: user.id }, { limit: 1 })
      .then((res) => {
        const p = asItems(res)[0] || null;
        setProfile(p);
        if (p) {
          setForm({
            contact_email: p.contact_email || user.email || "",
            whatsapp_number: p.whatsapp_number || "",
            availability: p.availability || "available",
            accepting_contact: p.accepting_contact !== false,
            notify_email: p.notify_email !== false,
            notify_whatsapp: p.notify_whatsapp === true,
            is_published: p.is_published !== false,
          });
        }
      })
      .finally(() => setLoading(false));
  }, [user]);

  async function save() {
    if (!profile) return;
    setSaving(true);
    try {
      await base44.entities.ArtistProfile.update(profile.id, form);
      toast.success("Paramètres enregistrés.");
    } catch (err) {
      toast.error(err.message || "L'enregistrement a échoué.");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(next) {
    setTogglingPublish(true);
    try {
      await setProfilePublished({ data: { profileId: profile.id, published: next } });
      setForm((f) => ({ ...f, is_published: next }));
      toast.success(next ? "Profil publié." : "Profil dépublié — il n'apparaît plus dans les recherches.");
    } catch (err) {
      toast.error(err.message || "La modification a échoué.");
    } finally {
      setTogglingPublish(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile || !form) {
    return (
      <div className="rounded-2xl border border-border bg-background p-8">
        <p className="text-[14px] font-medium">Votre compte n'a pas encore de profil artiste.</p>
        <Link
          to="/onboarding"
          className="mt-4 inline-block rounded-full bg-foreground px-5 py-2.5 text-[12.5px] font-medium text-background"
        >
          Créer mon profil
        </Link>
      </div>
    );
  }

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="space-y-6">
      <div>
        <p className="label-caps">Compte</p>
        <h1 className="mt-2 text-2xl font-semibold">Paramètres</h1>
        <p className="mt-1.5 text-[12.5px] text-muted-foreground">
          Coordonnées, notifications et confidentialité de votre profil.
        </p>
      </div>

      <section className="fade-up rounded-2xl border border-border bg-background p-6">
        <p className="flex items-center gap-2 text-[14px] font-medium">
          <UserRound className="h-4 w-4 text-primary" /> Compte
        </p>
        <span className="mt-4 block h-px w-10 bg-accent" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Nom du compte</Label>
            <Input value={user?.full_name || ""} readOnly className="mt-1.5 bg-secondary/50" />
          </div>
          <div>
            <Label>Email de connexion</Label>
            <Input value={user?.email || ""} readOnly className="mt-1.5 bg-secondary/50" />
          </div>
        </div>
        <p className="mt-3 text-[11.5px] text-muted-foreground">
          Le nom et l'email de connexion se modifient depuis les réglages du compte.
        </p>
      </section>

      <section className="fade-up rounded-2xl border border-border bg-background p-6">
        <p className="flex items-center gap-2 text-[14px] font-medium">
          <Mail className="h-4 w-4 text-primary" /> Coordonnées publiques
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="p-email">Email de contact affiché</Label>
            <Input
              id="p-email"
              type="email"
              value={form.contact_email}
              onChange={(e) => set("contact_email", e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="p-wa">Numéro WhatsApp</Label>
            <Input
              id="p-wa"
              value={form.whatsapp_number}
              onChange={(e) => set("whatsapp_number", e.target.value)}
              placeholder="+221 77 000 00 00"
              className="mt-1.5"
            />
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              Affiché sur votre profil sous forme de bouton « WhatsApp direct ».
            </p>
          </div>
        </div>

        <div className="mt-4">
          <Label>Disponibilité affichée</Label>
          <Select value={form.availability} onValueChange={(v) => set("availability", v)}>
            <SelectTrigger className="mt-1.5 sm:w-80">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Disponible pour des projets</SelectItem>
              <SelectItem value="open_to_collab">Ouvert aux collaborations</SelectItem>
              <SelectItem value="busy">Agenda chargé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      <section className="fade-up rounded-2xl border border-border bg-background p-6">
        <p className="flex items-center gap-2 text-[14px] font-medium">
          <Bell className="h-4 w-4 text-primary" /> Notifications
        </p>
        <div className="mt-2 divide-y divide-border">
          <ToggleRow
            title="Recevoir les demandes par email"
            text="Un email est envoyé dès qu'un client vous contacte ou vous répond."
            checked={form.notify_email}
            onChange={(v) => set("notify_email", v)}
          />
          <ToggleRow
            title="Autoriser le contact WhatsApp"
            text="Le client peut vous écrire directement sur WhatsApp depuis votre profil."
            checked={form.notify_whatsapp}
            onChange={(v) => set("notify_whatsapp", v)}
            icon={<MessageCircle className="h-3.5 w-3.5" />}
          />
          <ToggleRow
            title="Accepter de nouvelles demandes"
            text="Désactivez pour fermer temporairement votre formulaire de contact."
            checked={form.accepting_contact}
            onChange={(v) => set("accepting_contact", v)}
          />
        </div>
      </section>

      <section className="fade-up rounded-2xl border border-border bg-background p-6">
        <p className="flex items-center gap-2 text-[14px] font-medium">
          {form.is_published ? <Eye className="h-4 w-4 text-primary" /> : <EyeOff className="h-4 w-4 text-primary" />}
          Publication du profil
        </p>
        <p className="mt-1.5 max-w-2xl text-[12.5px] leading-relaxed text-muted-foreground">
          {form.is_published
            ? "Votre profil est publié : il apparaît dans les recherches, la galerie et le classement."
            : "Votre profil est en brouillon : il n'apparaît nulle part, mais reste accessible depuis votre espace."}
        </p>
        <button
          onClick={() => togglePublish(!form.is_published)}
          disabled={togglingPublish}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[12.5px] font-medium disabled:opacity-60"
        >
          {togglingPublish ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : form.is_published ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          {form.is_published ? "Dépublier mon profil" : "Publier mon profil"}
        </button>
      </section>

      <section className="fade-up rounded-2xl border border-border bg-background p-6">
        <p className="flex items-center gap-2 text-[14px] font-medium">
          <Lock className="h-4 w-4 text-primary" /> Sécurité
        </p>
        <div className="mt-3 space-y-2 text-[12.5px]">
          <Link to="/mfa" className="block text-primary hover:underline">
            Activer la double authentification
          </Link>
          <Link to="/forgot-password" className="block text-primary hover:underline">
            Changer mon mot de passe
          </Link>
          <button onClick={() => logout()} className="block text-foreground/70 hover:text-destructive">
            Se déconnecter
          </button>
        </div>
      </section>

      <div className="sticky bottom-4 flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-[12.5px] font-medium text-background shadow-lg disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}

function ToggleRow({ title, text, checked, onChange, icon }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-[13px] font-medium">
          {icon} {title}
        </p>
        <p className="mt-1 text-[11.5px] leading-relaxed text-muted-foreground">{text}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}