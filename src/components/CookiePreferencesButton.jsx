import { SlidersHorizontal } from "lucide-react";
import { CONSENT_EVENT } from "@/components/CookieConsent";

// Rouvre le bandeau de consentement depuis n'importe quelle page.
export default function CookiePreferencesButton({ dark = false }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_EVENT))}
      className={
        dark
          ? "inline-flex items-center gap-2 rounded-full border border-background/25 px-4 py-2 text-[12px] font-medium text-background/80 transition-colors hover:bg-background/10"
          : "inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-[12px] font-medium text-foreground/80 transition-colors hover:border-foreground/30 hover:text-foreground"
      }
    >
      <SlidersHorizontal className="h-3.5 w-3.5" />
      Gérer mes préférences
    </button>
  );
}