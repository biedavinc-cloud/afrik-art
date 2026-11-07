import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Send, X } from "lucide-react";
import AfricaMark from "@/components/ai/AfricaMark";
import { askAssistant } from "@/lib/platform-fns";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "Comment créer mon portfolio ?",
  "Quelle formule choisir ?",
  "Comment être mis en avant ?",
];

export default function AssistantWidget({ page = "", tone = "light" }) {
  const ask = useServerFn(askAssistant);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "model",
      content:
        "Bonjour 👋 Je suis l'assistant Afrik Art. Posez-moi vos questions sur votre portfolio, les formules ou la visibilité de votre travail.",
    },
  ]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open, busy]);

  async function send(text) {
    const question = (text ?? input).trim();
    if (!question || busy) return;
    setInput("");
    const history = messages
      .filter((m) => m.content)
      .slice(-6)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 600) }));
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setBusy(true);
    try {
      const res = await ask({ data: { message: question, page, history } });
      setMessages((prev) => [...prev, { role: "model", content: res.answer, unconfigured: !res.configured }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content:
            "Une erreur est survenue. Réessayez dans un instant ou écrivez-nous depuis la page Support.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  const isAdminHint = messages.some((m) => m.unconfigured);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Ouvrir l'assistant Afrik Art"
        className={cn(
          "group fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-foreground shadow-[0_20px_45px_-12px_rgba(0,0,0,0.6)] ring-1 ring-accent/40 transition-transform hover:scale-105",
          open && "scale-0 opacity-0"
        )}
      >
        <span className="pointer-events-none absolute -inset-1 rounded-full bg-accent/20 blur-md" />
        <span className="pointer-events-none absolute inset-0 rounded-full border border-accent/35 anim-aurora-slow" />
        <AfricaMark className="relative h-9 w-9 text-accent" strokeWidth={2.6} glow />
        <span className="absolute right-1 top-1 flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
        </span>
      </button>

      {open && (
        <div className="fixed bottom-4 right-4 z-50 flex h-[540px] w-[368px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
          <div className="relative overflow-hidden bg-foreground px-4 py-4 text-background">
            <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-accent/25 blur-2xl" />
            <div className="relative flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10">
                  <AfricaMark className="h-5 w-5 text-accent" strokeWidth={3} />
                </span>
                <div>
                  <p className="flex items-center gap-1.5 text-[13px] font-medium">
                    Assistant Afrik Art
                    <span className="flex items-center gap-1 text-[10px] font-normal text-background/50">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> en ligne
                    </span>
                  </p>
                  <p className="mt-0.5 text-[11px] text-background/60">
                    Portfolio, formules, visibilité — posez votre question.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer l'assistant"
                className="rounded-full p-1 text-background/70 transition-colors hover:bg-background/10 hover:text-background"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[12.5px] leading-relaxed",
                  m.role === "user"
                    ? "ml-auto bg-foreground text-background"
                    : "border border-border bg-secondary/50 text-foreground/85"
                )}
              >
                {m.content}
              </div>
            ))}

            {busy && (
              <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> L'assistant rédige…
              </div>
            )}

            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-border px-2.5 py-1 text-[11px] text-foreground/70 transition-colors hover:border-foreground/30 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {isAdminHint && (
              <p className="rounded-lg bg-secondary px-3 py-2 text-[11px] text-muted-foreground">
                Superadmin → Connecteurs → Assistant IA pour activer la clé Gemini.
              </p>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2 border-t border-border px-3 py-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={600}
              placeholder="Écrivez votre question…"
              className="h-10 flex-1 rounded-full border border-border bg-transparent px-3.5 text-[12.5px] outline-none focus-visible:border-foreground/40"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Envoyer"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}