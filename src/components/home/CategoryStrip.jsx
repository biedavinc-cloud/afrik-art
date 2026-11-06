import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import CategoryIcon from "@/components/CategoryIcon";
import { useI18n } from "@/lib/i18n";

export default function CategoryStrip({ categories }) {
  const { t } = useI18n();

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="label-caps">{t("home.cat.eyebrow")}</p>
          <h2 className="mt-3 text-[clamp(1.7rem,3.4vw,2.6rem)] font-semibold leading-tight">
            {t("home.cat.title")}
          </h2>
        </div>
        <Link
          to="/categories"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground/70 transition-colors hover:text-foreground"
        >
          {t("home.cat.all")}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {categories.slice(0, 10).map((c) => (
          <Link
            key={c.slug}
            to="/explorer"
            search={{ category: c.name }}
            className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-[0_14px_40px_-28px_rgba(21,21,21,0.5)]"
          >
            <CategoryIcon
              name={c.icon}
              className="h-5 w-5 text-primary transition-colors group-hover:text-accent"
            />
            <span className="mt-8 text-[13.5px] font-medium leading-snug">{c.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}