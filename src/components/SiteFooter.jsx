import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="mt-24 surface-teal text-background">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-[13px] font-semibold text-primary-foreground">
                AA
              </span>
              <span className="text-[15px] font-semibold tracking-tight">{t("brand.name")}</span>
            </div>
            <p className="mt-5 max-w-xs text-[13.5px] leading-relaxed text-background/55">
              {t("footer.about")}
            </p>
            <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-accent">
              {t("footer.claim")}
            </p>
            <div className="mt-6">
              <LanguageSwitcher dark />
            </div>
          </div>

          <FooterCol
            title={t("footer.discover")}
            links={[
              { label: t("nav.explore"), to: "/explorer" },
              { label: t("nav.gallery"), to: "/galerie" },
              { label: t("nav.journal"), to: "/actualites" },
              { label: t("nav.top"), to: "/top-artistes" },
              { label: t("nav.pricing"), to: "/tarifs" },
            ]}
          />
          <FooterCol
            title={t("footer.creators")}
            links={[
              { label: t("header.signup"), to: "/register" },
              { label: t("footer.login"), to: "/login" },
              { label: t("header.space"), to: "/dashboard" },
            ]}
          />
          <FooterCol
            title={t("footer.resources")}
            links={[
              { label: t("nav.guide"), to: "/guide-artiste" },
              { label: t("nav.faq"), to: "/faq" },
              { label: t("nav.support"), to: "/support" },
              { label: t("nav.contact"), to: "/contact-artiste" },
              { label: t("nav.search"), to: "/recherche" },
            ]}
          />
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-background/40">
              {t("footer.legal")}
            </p>
            <ul className="mt-5 space-y-3">
              {[
                { label: t("footer.terms"), to: "/conditions" },
                { label: t("footer.privacy"), to: "/confidentialite" },
                { label: "Cookies", to: "/cookies" },
                { label: t("footer.rights"), to: "/droits-auteur" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-[13.5px] text-background/60 transition-colors hover:text-background"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-background/10 pt-7 text-[12px] text-background/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 {t("brand.name")}. {t("footer.copy")}
          </p>
          <div className="flex flex-col gap-1 sm:items-end">
            <p>{t("footer.made")}</p>
            <p>
              {t("footer.dev")}{" "}
              <a
                href="https://liafrik.com"
                target="_blank"
                rel="noreferrer noopener"
                className="font-medium text-background/70 underline decoration-background/25 underline-offset-2 transition-colors hover:text-background"
              >
                Liaffrik Tech
              </a>{" "}
              — Dubaï · Yaoundé
            </p>
          </div>
        </div>
      </div>
      <div className="h-1 w-full bg-accent" />
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-background/40">
        {title}
      </p>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.to + l.label}>
            <Link
              to={l.to}
              className="text-[13.5px] text-background/60 transition-colors hover:text-background"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}