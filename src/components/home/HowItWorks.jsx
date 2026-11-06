import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export default function HowItWorks() {
  const { t } = useI18n();

  const steps = [
    { n: "01", title: t("how.s1t"), text: t("how.s1x") },
    { n: "02", title: t("how.s2t"), text: t("how.s2x") },
    { n: "03", title: t("how.s3t"), text: t("how.s3x") },
  ];

  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="label-caps">{t("how.eyebrow")}</p>
            <h2 className="mt-3 text-[clamp(1.7rem,3.4vw,2.6rem)] font-semibold leading-tight">
              {t("how.title")}
            </h2>
            <p className="mt-5 max-w-md text-[14.5px] leading-relaxed text-muted-foreground">
              {t("how.text")}
            </p>
            <Link
              to="/register"
              className="mt-8 inline-flex rounded-full bg-foreground px-6 py-3 text-[13px] font-medium text-background transition-colors hover:bg-primary"
            >
              {t("how.cta")}
            </Link>
          </div>

          <div className="space-y-0">
            {steps.map((s, i) => (
              <div
                key={s.n}
                className={`flex gap-6 py-7 ${i !== 0 ? "border-t border-border" : ""}`}
              >
                <span className="text-[12px] font-medium tracking-[0.1em] text-accent">
                  {s.n}
                </span>
                <div>
                  <h3 className="text-[16px] font-medium">{s.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
                    {s.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}