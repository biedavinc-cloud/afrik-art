import { useI18n } from "@/lib/i18n";
import { LANGUAGES } from "@/lib/dictionaries";
import { cn } from "@/lib/utils";

export default function LanguageSwitcher({ dark = false }) {
  const { lang, setLang } = useI18n();

  return (
    <div
      className={cn(
        "flex items-center rounded-full border p-0.5",
        dark ? "border-background/20" : "border-border"
      )}
    >
      {LANGUAGES.map((l) => {
        const active = l.code === lang;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLang(l.code)}
            aria-pressed={active}
            className={cn(
              "rounded-full px-2 py-1 text-[10.5px] font-medium uppercase tracking-[0.04em] transition-colors",
              active
                ? dark
                  ? "bg-background text-foreground"
                  : "bg-foreground text-background"
                : dark
                  ? "text-background/60 hover:text-background"
                  : "text-muted-foreground hover:text-foreground"
            )}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}