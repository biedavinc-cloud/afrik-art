import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Archive,
  Inbox,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Send,
  Undo2,
} from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  getThreadMessages,
  listThreads,
  replyToThread,
  setThreadStatus,
} from "@/lib/messaging-fns";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/_app/messagerie")({
  head: () => ({ meta: [{ title: "Messagerie | Afrik Art" }] }),
  component: MessagingPage,
});

const TYPE_LABELS = {
  exposition: "Exposition",
  achat: "Achat d'œuvre",
  commande: "Commande",
  presse: "Presse",
  collaboration: "Collaboration",
  autre: "Autre",
};

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function MessagingPage() {
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [thread, setThread] = useState(null);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [tab, setTab] = useState("open");
  const endRef = useRef(null);

  useEffect(() => {
    listThreads()
      .then((res) => {
        setThreads(res.threads || []);
        if (res.threads?.[0]) setActiveId(res.threads[0].id);
      })
      .catch(() => toast.error("Impossible de charger vos conversations."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!activeId) return;
    setMessages([]);
    getThreadMessages({ data: { threadId: activeId } })
      .then((res) => {
        setThread(res.thread);
        setMessages(res.messages || []);
        setThreads((all) =>
          all.map((t) =>
            t.id === activeId
              ? {
                  ...t,
                  [t.viewer_role === "artist" ? "artist_unread" : "client_unread"]: 0,
                }
              : t
          )
        );
      })
      .catch(() => toast.error("Conversation indisponible."));
  }, [activeId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  async function send(e) {
    e.preventDefault();
    const body = draft.trim();
    if (!body || !activeId) return;
    setSending(true);
    try {
      const res = await replyToThread({ data: { threadId: activeId, body } });
      setMessages((all) => [...all, res.message]);
      setDraft("");
      setThreads((all) =>
        all.map((t) =>
          t.id === activeId ? { ...t, last_message: body, last_message_at: new Date().toISOString() } : t
        )
      );
      if (!res.emailed) {
        toast.success("Message envoyé.");
      } else {
        toast.success("Message envoyé et notifié par email.");
      }
    } catch (err) {
      toast.error(err.message || "L'envoi a échoué.");
    } finally {
      setSending(false);
    }
  }

  async function toggleArchive() {
    if (!activeId || !thread) return;
    const status = thread.status === "archived" ? "open" : "archived";
    await setThreadStatus({ data: { threadId: activeId, status } });
    setThread({ ...thread, status });
    setThreads((all) => all.map((t) => (t.id === activeId ? { ...t, status } : t)));
  }

  const visible = threads.filter((t) =>
    tab === "open" ? t.status !== "archived" : t.status === "archived"
  );
  const other = thread
    ? thread.viewer_role === "artist"
      ? { name: thread.client_name, email: thread.client_email, phone: thread.client_phone }
      : { name: thread.artist_name, email: thread.profile_email, phone: thread.artist_phone }
    : null;

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label-caps">Messagerie</p>
          <h1 className="mt-2 text-2xl font-semibold">Conversations</h1>
          <p className="mt-1.5 text-[12.5px] text-muted-foreground">
            Les clients qui vous contactent arrivent ici. Vous pouvez répondre directement,
            par email ou sur WhatsApp.
          </p>
        </div>
        <div className="flex gap-2">
          {[
            { key: "open", label: "En cours" },
            { key: "archived", label: "Archivées" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "rounded-full px-4 py-1.5 text-[12px] font-medium transition-colors",
                tab === t.key
                  ? "bg-foreground text-background"
                  : "border border-border bg-background text-foreground/70"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <div className="max-h-[620px] space-y-2 overflow-y-auto rounded-2xl border border-border bg-background p-2">
          {visible.length === 0 ? (
            <div className="px-4 py-14 text-center">
              <Inbox className="mx-auto h-5 w-5 text-muted-foreground" />
              <p className="mt-3 text-[13px] font-medium">Aucune conversation</p>
              <p className="mt-1 text-[12px] text-muted-foreground">
                Vos échanges avec les clients apparaîtront ici.
              </p>
            </div>
          ) : (
            visible.map((t) => {
              const unread = t.viewer_role === "artist" ? t.artist_unread : t.client_unread;
              const name = t.viewer_role === "artist" ? t.client_name : t.artist_name;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveId(t.id)}
                  className={cn(
                    "w-full rounded-xl px-3.5 py-3 text-left transition-colors",
                    activeId === t.id ? "bg-secondary" : "hover:bg-secondary/60"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[13px] font-medium">{name}</p>
                    {unread > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                        {unread}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-[11.5px] text-muted-foreground">
                    {TYPE_LABELS[t.collaboration_type] || "Demande"} · {formatDate(t.last_message_at)}
                  </p>
                  <p className="mt-1.5 line-clamp-2 text-[12px] text-foreground/70">{t.last_message}</p>
                </button>
              );
            })
          )}
        </div>

        <div className="flex min-h-[520px] flex-col rounded-2xl border border-border bg-background">
          {!thread ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <MessageSquare className="h-6 w-6 text-muted-foreground" />
              <p className="mt-3 text-[13.5px] font-medium">Sélectionnez une conversation</p>
              <p className="mt-1 max-w-sm text-[12.5px] text-muted-foreground">
                Chaque demande reçue depuis votre profil public s'ouvre ici avec le message du client.
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
                <div>
                  <p className="text-[13.5px] font-medium">{thread.subject}</p>
                  <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                    {other?.name}
                    {other?.email ? ` · ${other.email}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {other?.email && (
                    <a
                      href={`mailto:${other.email}?subject=${encodeURIComponent(thread.subject || "Afrik Art")}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11.5px] hover:bg-secondary"
                    >
                      <Mail className="h-3.5 w-3.5" /> Email
                    </a>
                  )}
                  {other?.phone && (
                    <a
                      href={`https://wa.me/${other.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11.5px] hover:bg-secondary"
                    >
                      <Phone className="h-3.5 w-3.5" /> WhatsApp
                    </a>
                  )}
                  <button
                    onClick={toggleArchive}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11.5px] hover:bg-secondary"
                  >
                    {thread.status === "archived" ? (
                      <>
                        <Undo2 className="h-3.5 w-3.5" /> Réouvrir
                      </>
                    ) : (
                      <>
                        <Archive className="h-3.5 w-3.5" /> Archiver
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
                {messages.map((m) => {
                  const mine = user?.id === m.sender_user_id;
                  return (
                    <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed",
                          mine
                            ? "bg-foreground text-background"
                            : "bg-secondary text-foreground"
                        )}
                      >
                        <p className="mb-1 text-[10px] uppercase tracking-[0.12em] opacity-60">
                          {m.sender_name || (m.sender_role === "artist" ? "Artiste" : "Client")} ·{" "}
                          {formatDate(m.created_date)}
                        </p>
                        <p className="whitespace-pre-line">{m.body}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={endRef} />
              </div>

              <form onSubmit={send} className="border-t border-border p-4">
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={3}
                  placeholder="Écrivez votre réponse…"
                  className="resize-none"
                />
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-[11px] text-muted-foreground">
                    Le destinataire est prévenu par email.
                  </p>
                  <button
                    type="submit"
                    disabled={sending || !draft.trim()}
                    className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[12.5px] font-medium text-background transition-colors hover:bg-primary disabled:opacity-50"
                  >
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Envoyer
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}