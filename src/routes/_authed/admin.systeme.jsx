import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CheckCircle2, Loader2, Mail, XCircle } from "lucide-react";
import { getSystemStatus, sendTestEmailToMe } from "@/lib/admin-fns";

export const Route = createFileRoute("/_authed/admin/systeme")({
  head: () => ({ meta: [{ title: "Système | Afrik Art" }] }),
  component: AdminSystem,
});

function Row({ ok, label, detail, optional }) {
  return (
    <li className="flex items-start gap-3 py-3">
      {ok ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
      ) : (
        <XCircle className={`mt-0.5 h-5 w-5 shrink-0 ${optional ? "text-muted-foreground" : "text-destructive"}`} />
      )}
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {detail && <p className="mt-0.5 break-words text-[13px] leading-relaxed text-muted-foreground">{detail}</p>}
      </div>
    </li>
  );
}

function AdminSystem() {
  const { data, isPending, error } = useQuery({ queryKey: ["admin", "system"], queryFn: () => getSystemStatus() });
  const [sending, setSending] = useState(false);
  const [mail, setMail] = useState(null);

  async function test() {
    setSending(true);
    setMail(null);
    try {
      setMail(await sendTestEmailToMe());
    } catch (err) {
      setMail({ ok: false, message: err.message || "Échec du test." });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Superadmin</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Système</h1>
      <p className="mt-2 text-sm text-muted-foreground">État des services de la plateforme et test d'envoi d'e-mail.</p>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">Services</h2>
        {isPending && <p className="mt-4 text-sm text-muted-foreground">Chargement…</p>}
        {error && <p className="mt-4 text-sm text-destructive">{error.message}</p>}
        {data && (
          <ul className="mt-2 divide-y divide-border">
            <Row ok={data.database === "ok"} label="Base de données (D1)" detail={data.database === "ok" ? "Connectée, schéma à jour." : "Inaccessible : vérifiez le binding DB."} />
            <Row ok={data.storage === "ok"} label="Stockage des images (R2)" detail={data.storage === "ok" ? "Bucket relié." : "Binding FILES absent : les envois d'images échoueront."} />
            <Row ok={data.emailBinding === "ok"} label="Envoi d'e-mails (binding EMAIL)" detail={data.emailBinding === "ok" ? `Expéditeur : ${data.sender}` : "Binding EMAIL absent."} />
            <Row
              ok={data.superadmins > 0}
              label="Super administrateurs"
              detail={data.superadmins > 0 ? `${data.superadmins} adresse(s) déclarée(s) (secret SUPERADMIN_EMAILS).` : "Secret SUPERADMIN_EMAILS non défini : personne ne peut devenir admin à l'inscription."}
            />
            <Row ok={data.google} optional label="Connexion Google" detail={data.google ? "Activée." : "Désactivée (optionnel) : secrets GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET non définis."} />
            <Row ok label="Adresse publique" detail={`${data.publicUrl} · environnement : ${data.environment}`} />
          </ul>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">Test d'envoi d'e-mail</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Envoie un message de test à votre propre adresse. En cas d'échec, le code d'erreur exact de Cloudflare et l'action à mener s'affichent.
        </p>
        <button
          type="button"
          onClick={test}
          disabled={sending}
          className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          Envoyer un e-mail de test
        </button>

        {mail && (
          <div className={`mt-5 rounded-xl p-4 text-sm ${mail.ok ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-900"}`}>
            {mail.ok ? (
              <p>
                Message envoyé à <strong>{mail.to}</strong>. Vérifiez votre boîte de réception et vos courriers indésirables.
              </p>
            ) : (
              <>
                <p className="font-semibold">Échec de l'envoi{mail.code ? ` (${mail.code})` : ""}</p>
                {mail.hint && <p className="mt-1.5 leading-relaxed">{mail.hint}</p>}
                {mail.message && mail.message !== mail.hint && <p className="mt-1.5 break-words text-[13px] opacity-80">Détail : {mail.message}</p>}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
