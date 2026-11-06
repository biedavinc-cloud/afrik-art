import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Globe2, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import ArtistCard from "@/components/ArtistCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { searchArtists } from "@/lib/server-fns";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_site/explorer")({
  validateSearch: (s) => ({
    q: s.q || undefined,
    country: s.country || undefined,
    city: s.city || undefined,
    category: s.category || undefined,
    specialty: s.specialty || undefined,
    availability: s.availability || undefined,
    premiumOnly: s.premiumOnly === true || s.premiumOnly === "true" ? true : undefined,
    sort: s.sort || undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => searchArtists({ data: deps }),
  head: () => ({
    meta: [
      { title: "Explorer les talents africains | Afrik Art" },
      {
        name: "description",
        content:
          "Parcourez les artistes, photographes, musiciens et créateurs africains par pays, ville et discipline. Contact direct, profils vérifiés.",
      },
    ],
  }),
  component: ExplorerPage,
});

const clean = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== "" && v !== false));

function ExplorerPage() {
  const { items, total, facets } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(search);

  useEffect(() => setForm(search), [search]);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  function apply(e) {
    if (e) e.preventDefault();
    navigate({ to: "/explorer", search: clean(form) });
    setOpen(false);
  }

  function reset() {
    setForm({});
    navigate({ to: "/explorer", search: {} });
    setOpen(false);
  }

  function removeFilter(key) {
    const next = { ...search };
    delete next[key];
    setForm(next);
    navigate({ to: "/explorer", search: clean(next) });
  }

  const SORTS = [
    { value: "pertinence", label: t("explorer.sort.relevance") },
    { value: "recent", label: t("explorer.sort.recent") },
    { value: "populaire", label: t("explorer.sort.popular") },
  ];

  const chips = [
    search.q && { key: "q", label: `« ${search.q} »` },
    search.country && { key: "country", label: search.country },
    search.city && { key: "city", label: search.city },
    search.category && { key: "category", label: search.category },
    search.specialty && { key: "specialty", label: search.specialty },
    search.availability && { key: "availability", label: t(`avail.${search.availability}`) },
    search.premiumOnly && { key: "premiumOnly", label: t("explorer.proOnly") },
  ].filter(Boolean);

  const countries = (facets.countries || []).slice(0, 9);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <p className="label-caps">{t("explorer.eyebrow")}</p>
          <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.2rem)] font-semibold leading-tight">
            {t("explorer.title")}
          </h1>
          <p className="mt-4 text-[14.5px] leading-relaxed text-muted-foreground">
            {total > 1
              ? t("explorer.countPlural", { n: total })
              : t("explorer.count", { n: total })}{" "}
            {t("explorer.countNote")}
          </p>
        </div>

        <div className="flex gap-8 border-t border-border pt-6 lg:border-0 lg:pt-0">
          <div>
            <p className="font-heading text-2xl font-semibold">{facets.countries?.length || 0}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Pays représentés
            </p>
          </div>
          <div>
            <p className="font-heading text-2xl font-semibold">{facets.categories?.length || 0}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Disciplines
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={apply}
        className="mt-9 rounded-2xl border border-border bg-card p-3 shadow-[0_18px_50px_-42px_rgba(21,21,21,0.5)] sm:p-4"
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={form.q || ""}
              onChange={(e) => set("q")(e.target.value)}
              placeholder={t("explorer.q")}
              className="h-12 rounded-full border-0 bg-secondary/60 pl-11 pr-4 text-[13.5px] focus-visible:ring-1"
            />
          </div>

          <Select value={form.sort || "pertinence"} onValueChange={set("sort")}>
            <SelectTrigger className="h-12 w-full rounded-full px-5 text-[13px] lg:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORTS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <button
            type="submit"
            className="h-12 shrink-0 rounded-full bg-foreground px-7 text-[13px] font-medium text-background transition-colors hover:bg-primary"
          >
            {t("explorer.search")}
          </button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border px-5 text-[13px] font-medium lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {t("explorer.filters")}
            {chips.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] text-foreground">
                {chips.length}
              </span>
            )}
          </button>
        </div>

        {countries.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-border/70 pt-3">
            <span className="mr-1 inline-flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              <Globe2 className="h-3 w-3" /> Pays
            </span>
            {countries.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  const next = clean({
                    ...search,
                    country: search.country === c ? undefined : c,
                  });
                  setForm(next);
                  navigate({ to: "/explorer", search: next });
                }}
                className={cn(
                  "rounded-full px-3 py-1 text-[11.5px] transition-colors",
                  search.country === c
                    ? "bg-foreground text-background"
                    : "bg-secondary text-foreground/70 hover:bg-secondary/70"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </form>

      {chips.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Filtres actifs
          </span>
          {chips.map((c) => (
            <button
              key={c.key}
              onClick={() => removeFilter(c.key)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[11.5px] font-medium hover:border-foreground/30"
            >
              {c.label}
              <X className="h-3 w-3" />
            </button>
          ))}
          <button
            onClick={reset}
            className="text-[11.5px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            {t("explorer.reset")}
          </button>
        </div>
      )}

      <div className="mt-9 grid gap-10 lg:grid-cols-[250px_1fr] lg:gap-12">
        <aside className={`${open ? "block" : "hidden"} lg:block`}>
          <div className="space-y-5 rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-28">
            <div className="flex items-center justify-between">
              <p className="inline-flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.16em]">
                <SlidersHorizontal className="h-3.5 w-3.5" /> {t("explorer.filters")}
              </p>
              <button
                type="button"
                onClick={reset}
                className="text-[11.5px] text-muted-foreground hover:text-foreground"
              >
                {t("explorer.reset")}
              </button>
            </div>

            <FilterSelect
              label={t("explorer.country")}
              value={form.country}
              onChange={set("country")}
              options={facets.countries}
              placeholder={t("explorer.allCountries")}
            />
            <FilterSelect
              label={t("explorer.city")}
              value={form.city}
              onChange={set("city")}
              options={facets.cities}
              placeholder={t("explorer.allCities")}
            />
            <FilterSelect
              label={t("explorer.category")}
              value={form.category}
              onChange={set("category")}
              options={facets.categories}
              placeholder={t("explorer.allCats")}
            />

            <div>
              <Label className="text-[12px] text-foreground/70">{t("explorer.specialty")}</Label>
              <Input
                value={form.specialty || ""}
                onChange={(e) => set("specialty")(e.target.value)}
                placeholder={t("explorer.specialtyPh")}
                className="mt-1.5 h-10"
              />
            </div>

            <FilterSelect
              label={t("explorer.availability")}
              value={form.availability}
              onChange={set("availability")}
              options={[
                { value: "available", label: t("avail.available") },
                { value: "open_to_collab", label: t("avail.open_to_collab") },
                { value: "busy", label: t("avail.busy") },
              ]}
              placeholder={t("explorer.all")}
            />

            <label className="flex cursor-pointer items-center gap-2.5 pt-1">
              <Checkbox
                checked={Boolean(form.premiumOnly)}
                onCheckedChange={(v) => set("premiumOnly")(v ? true : undefined)}
              />
              <span className="text-[12.5px]">{t("explorer.proOnly")}</span>
            </label>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => apply()}
                className="flex-1 rounded-full bg-foreground px-4 py-2.5 text-[12.5px] font-medium text-background"
              >
                {t("explorer.apply")}
              </button>
              {open && (
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-border px-3"
                  aria-label={t("explorer.closeFilters")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <p className="inline-flex items-center gap-2 text-[12.5px] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {items.length} {items.length > 1 ? "profils affichés" : "profil affiché"}
            </p>
            <div className="hidden items-center gap-2 lg:flex">
              <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Trier
              </span>
              <Select
                value={search.sort || "pertinence"}
                onValueChange={(v) =>
                  navigate({ to: "/explorer", search: clean({ ...search, sort: v }) })
                }
              >
                <SelectTrigger className="h-9 w-40 rounded-full text-[12px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORTS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border px-6 py-20 text-center">
              <p className="text-[15px] font-medium">{t("explorer.empty")}</p>
              <p className="mt-2 text-[13px] text-muted-foreground">{t("explorer.emptyText")}</p>
              <button
                onClick={reset}
                className="mt-6 rounded-full bg-foreground px-5 py-2.5 text-[12.5px] font-medium text-background"
              >
                {t("explorer.resetFilters")}
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
              {items.map((a) => (
                <ArtistCard key={a.id} artist={a} sponsored={a.boosted} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options, placeholder }) {
  const normalized = (options || []).map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );
  return (
    <div>
      <Label className="text-[12px] text-foreground/70">{label}</Label>
      <Select value={value || "all"} onValueChange={(v) => onChange(v === "all" ? undefined : v)}>
        <SelectTrigger className="mt-1.5 h-10">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{placeholder}</SelectItem>
          {normalized.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}