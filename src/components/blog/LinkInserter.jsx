import { useState } from "react";
import { Link2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

// Transforme le texte sélectionné dans l'éditeur en lien : [texte](adresse).
export default function LinkInserter({ textareaRef, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  function insert() {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    if (start === end) {
      toast.error("Sélectionnez d'abord dans le texte la portion à transformer en lien.");
      return;
    }

    const raw = url.trim();
    if (!raw) {
      toast.error("Indiquez l'adresse du lien.");
      return;
    }
    const href = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    try {
      new URL(href);
    } catch {
      toast.error("Cette adresse n'est pas valide.");
      return;
    }

    const markdown = `[${value.slice(start, end)}](${href})`;
    onChange(`${value.slice(0, start)}${markdown}${value.slice(end)}`);
    setUrl("");
    setOpen(false);

    requestAnimationFrame(() => {
      el.focus();
      const cursor = start + markdown.length;
      el.setSelectionRange(cursor, cursor);
    });
  }

  return (
    <div className="mt-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11.5px] font-medium text-foreground/80 transition-colors hover:border-accent/60 hover:bg-secondary"
        >
          <Link2 className="h-3.5 w-3.5" /> Insérer un lien
        </button>
        <span className="text-[11px] text-muted-foreground">
          Sélectionnez du texte, puis collez l'adresse.
        </span>
      </div>

      {open && (
        <div className="mt-2 flex flex-col gap-2 rounded-xl border border-border bg-secondary/40 p-3 sm:flex-row">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                insert();
              }
            }}
            placeholder="https://exemple.com"
            className="h-9 bg-background"
            aria-label="Adresse du lien"
          />
          <button
            type="button"
            onClick={insert}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-[12px] font-medium text-background"
          >
            <Plus className="h-3.5 w-3.5" /> Ajouter le lien
          </button>
        </div>
      )}
    </div>
  );
}