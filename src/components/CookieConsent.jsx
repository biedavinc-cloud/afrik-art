import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cookie, ShieldCheck } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export const CONSENT_KEY = "afrikart-consent-v1";
export const CONSENT_EVENT = "afrikart:open-consent";

// Transmet le choix du visiteur via Google Consent Mode v2.
function sendConsent({ analytics, ads }) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  const gtag =
    window.gtag ||
    function () {
      window.dataLayer.push(arguments);
    };
  gtag("consent", "update", {
    analytics_storage: analytics ? "granted" : "denied",
    ad_storage: ads ? "granted" : "denied",
    ad_user_data: ads ? "granted" : "denied",
    ad_personalization: ads ? "granted" : "denied",
  });
}

function readChoice() {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [ads, setAds] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = readChoice();
    if (saved) {
      setAnalytics(Boolean(saved.analytics));
      setAds(Boolean(saved.ads));
      sendConsent({ analytics: Boolean(saved.analytics), ads: Boolean(saved.ads) });
    } else {
      setOpen(true);
    }
    const reopen = () => {
      const current = readChoice();
      setAnalytics(Boolean(current?.analytics));
      setAds(Boolean(current?.ads));
      setDetails(true);
      setOpen(true);
    };
    window.addEventListener(CONSENT_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_EVENT, reopen);
  }, []);

  function persist(choice) {
    try {
      window.localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify({ ...choice, saved_at: new Date().toISOString() })
      );
    } catch {
      /* stockage indisponible : le choix reste valable pour la session */
    }
    sendConsent(choice);
    setAnalytics(choice.analytics);
    setAds(choice.ads);
    setOpen(false);
    setDetails(false);
  }

  if (!mounted || !open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[9999] p-3 sm:p-5">
      <div className="fade-up mx-auto max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-foreground text-background shadow-[0_30px_70px_-25px_rgba(0,0,0,0.75)]">
        <div className="flex flex-col gap-4 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
              <Cookie className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[13.5px] font-medium">Votre vie privée, votre choix</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-background/60">
                Nous utilisons des cookies indispensables au fonctionnement du site, et — avec votre
                accord — des cookies de mesure d'audience et de personnalisation. Vous pouvez changer
                d'avis à tout moment depuis la page{" "}
                <Link to="/cookies" className="underline decoration-background/30 underline-offset-2 hover:text-background">
                  Cookies
                </Link>
                .
              </p>
            </div>
          </div>

          {details && (
            <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.04] p-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[12px] font-medium">Cookies essentiels</p>
                  <p className="text-[11px] text-background/50">Connexion, sécurité, langue. Toujours actifs.</p>
                </div>
                <span className="flex items-center gap-1 text-[10.5px] uppercase tracking-[0.14em] text-background/45">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent" /> Requis
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-2.5">
                <div>
                  <p className="text-[12px] font-medium">Mesure d'audience</p>
                  <p className="text-[11px] text-background/50">Statistiques anonymes de visite.</p>
                </div>
                <Switch checked={analytics} onCheckedChange={setAnalytics} />
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-2.5">
                <div>
                  <p className="text-[12px] font-medium">Personnalisation & publicité</p>
                  <p className="text-[11px] text-background/50">Contenus et campagnes adaptés.</p>
                </div>
                <Switch checked={ads} onCheckedChange={setAds} />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setDetails((v) => !v)}
              className="text-left text-[11.5px] text-background/50 underline decoration-background/25 underline-offset-2 transition-colors hover:text-background/80"
            >
              {details ? "Masquer les préférences" : "Personnaliser"}
            </button>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => persist({ analytics: false, ads: false })}
                className={cn(
                  "h-10 rounded-full border border-white/25 px-5 text-[12.5px] font-medium text-background transition-colors hover:bg-white/10"
                )}
              >
                Tout refuser
              </button>
              <button
                type="button"
                onClick={() => persist(details ? { analytics, ads } : { analytics: true, ads: true })}
                className="h-10 rounded-full bg-accent px-5 text-[12.5px] font-semibold text-accent-foreground transition-opacity hover:opacity-90"
              >
                {details ? "Enregistrer mes choix" : "Tout accepter"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}