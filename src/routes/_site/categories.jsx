import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import CategoryIcon from "@/components/CategoryIcon";
import { getPublicCategories } from "@/lib/server-fns";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_site/categories")({
  loader: async () => ({ categories: await getPublicCategories() }),
  head: () => ({
    meta: [
      { title: "Catégories artistiques | Afrik Art" },
      {
        name: "description",
        content:
          "Photographie, peinture, sculpture, mode, musique, cinéma, artisanat : parcourez toutes les disciplines créatives africaines.",
      },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const { categories } = Route.useLoaderData();
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
      <div className="max-w-2xl">
        <p className="label-caps">{t("cats.eyebrow")}</p>
        <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.2rem)] font-semibold leading-tight">
          {t("cats.title")}
        </h1>
        <p className="mt-4 text-[14.5px] leading-relaxed text-muted-foreground">
          {t("cats.text")}
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Link
            key={c.id}
            to="/explorer"
            search={{ category: c.name }}
            className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-[0_16px_44px_-30px_rgba(21,21,21,0.5)]"
          >
            <div className="flex items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <CategoryIcon name={c.icon} className="h-5 w-5" />
              </span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
            </div>
            <div className="mt-7">
              <h2 className="text-[16px] font-medium">{c.name}</h2>
              {c.description && (
                <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
                  {c.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}