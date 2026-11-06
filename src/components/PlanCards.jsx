import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { DEFAULT_PLANS, localizedPlan } from "@/lib/plans";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export default function PlanCards({ plans = DEFAULT_PLANS, compact = false }) {
  const { lang, t } = useI18n();

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {plans.map((raw) => {
        const plan = localizedPlan(raw, lang);
        const featured = plan.key === "pro";
        return (
          <div
            key={plan.key}
            className={cn(
              "relative flex flex-col rounded-2xl border p-7 transition-all duration-300",
              featured
                ? "border-primary bg-primary text-primary-foreground shadow-[0_24px_60px_-30px_rgba(227,29,43,0.55)]"
                : "border-border bg-card hover:border-foreground/20"
            )}
          >
            {featured && (
              <span className="absolute -top-3 left-7 rounded-full bg-background px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                {t("plan.mostChosen")}
              </span>
            )}
            <p
              className={cn(
                "text-[11px] font-medium uppercase tracking-[0.22em]",
                featured ? "text-primary-foreground/60" : "text-muted-foreground"
              )}
            >
              {plan.tagline}
            </p>
            <h3 className="mt-3 text-xl font-semibold">{plan.name}</h3>
            <div className="mt-5 flex items-end gap-1.5">
              <span className="text-[42px] font-semibold leading-none tracking-tight">
                {plan.price === 0 ? "0" : plan.price}
                <span className="ml-1 text-xl font-normal">$</span>
              </span>
              <span
                className={cn(
                  "pb-1.5 text-[12px]",
                  featured ? "text-primary-foreground/60" : "text-muted-foreground"
                )}
              >
                {t("plan.perMonth")}
              </span>
            </div>

            <ul className="mt-7 flex-1 space-y-3">
              {plan.features.slice(0, compact ? 5 : plan.features.length).map((f) => (
                <li key={f} className="flex gap-2.5 text-[13px] leading-relaxed">
                  <Check
                    className={cn(
                      "mt-0.5 h-3.5 w-3.5 shrink-0",
                      featured ? "text-accent" : "text-primary"
                    )}
                    strokeWidth={2.4}
                  />
                  <span className={featured ? "text-primary-foreground/85" : "text-foreground/75"}>
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              to={plan.price === 0 ? "/register" : "/dashboard/abonnement"}
              className={cn(
                "mt-8 rounded-full px-5 py-3 text-center text-[13px] font-medium transition-colors",
                featured
                  ? "bg-accent text-foreground hover:bg-accent/90"
                  : "bg-foreground text-background hover:bg-primary"
              )}
            >
              {plan.price === 0
                ? t("plan.start")
                : t("plan.choose", { name: plan.name })}
            </Link>
          </div>
        );
      })}
    </div>
  );
}