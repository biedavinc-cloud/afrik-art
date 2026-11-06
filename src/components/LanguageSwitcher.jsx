import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LANGUAGES } from "@/lib/dictionaries";
import { cn } from "@/lib/utils";

const NAMES = {
  fr: "Français",
  en: "English",
  es: "Español",
  pt: "Português",
  sw: "Kiswahili",
};

// Sélecteur compact : un seul bouton globe + code, la liste s'ouvre au clic.
export default function LanguageSwitcher({ dark = false, align = "right" }) {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const active = LANGUAGES.find((l) => l.code === lang);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Changer de langue"
        className={cn(
          "flex h-9 items-center gap-1.5 rounded-full border px-2.5 text-[11.5px] font-medium uppercase tracking-[0.06em] transition-colors",
          dark
            ? "border-background/25 text-background/80 hover:border-background/50 hover:text-background"
            : "border-border text-foreground/70 hover:border-foreground/30 hover:text-foreground"
        )}
      >
        <Globe className="h-[15px] w-[15px]" strokeWidth={1.7} />
        {active?.label || "FR"}
        <ChevronDown
          className={cn("h-3 w-3 transition-transform", open && "rotate-180")}
          strokeWidth={2}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className={cn(
            "absolute z-50 mt-2 w-44 overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-xl",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {LANGUAGES.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                role="option"
                aria-selected={l.code === lang}
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-[12.5px] transition-colors",
                  l.code === lang
                    ? "bg-secondary font-medium text-foreground"
                    : "text-foreground/70 hover:bg-secondary/60"
                )}
              >
                <span>{NAMES[l.code] || l.label}</span>
                {l.code === lang ? (
                  <Check className="h-3.5 w-3.5 text-accent" strokeWidth={2.4} />
                ) : (
                  <span className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                    {l.label}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}