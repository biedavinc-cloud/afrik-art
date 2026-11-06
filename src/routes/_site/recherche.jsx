import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
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
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_site/recherche")({
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
      { title: "Recherche avancée de talents | Afrik Art" },
      {
        name: "description",
        content:
          "Filtrez les artistes africains par pays, ville, discipline et disponibilité pour vos collaborations.",
      },
    ],
  }),
  component: AdvancedSearchPage,
});

const AVAILABILITY = [
  { value: "available", label: "Disponible pour des projets" },
  { value: "open_to_collab", label: "Ouvert aux collaborations" },
  { value: "busy", label: "Agenda chargé" },
];

function AdvancedSearchPage() {
  const { items, total, facets } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [form, setForm] = useState(search);
  const [open, setOpen] = useState(false);

  useEffect(() => setForm(search), [search]);
  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  function apply(e) {
    if (e) e.preventDefault();
    const clean = Object.fromEntries(
      Object.entries(form).filter(([, v]) => v !== undefined && v !== "" && v !== false)
    );
    navigate({ to: "/recherche", search: clean });
    setOpen(false);
  }

  function reset() {
    setForm({});
    navigate({ to: "/recherche", search: {} });
    setOpen(false);
  }

  const chips = [
    search.q && { key: "q", label: `« ${search.q} »` },
    search.country && { key: "country", label: search.country },
    search.city && { key: "city", label: search.city },
    search.category && { key: "category", label: search.category },
    search.specialty && { key: "specialty", label: search.specialty },
    search.availability && {
      key: "availability",
      label: AVAILABILITY.find((a) => a.value === search.availability)?.label || search.availability,
    },
    search.premiumOnly && { key: "premiumOnly", label: "Pro & Premium" },
  ].filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="max-w-2xl">
        <p className="label-caps">Recherche avancée</p>
        <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.1rem)] font-semibold leading-tight">
          Trouver le talent juste
        </h1>
        <p className="mt-4 text-[14.5px] leading-relaxed text-muted-foreground">
          Croisez pays, discipline et disponibilité pour composer une sélection adaptée à votre
          projet — exposition, campagne, résidence ou reportage.
        </p>
      </div>

      <form onSubmit={apply} className="mt-8 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={form.q || ""}
            onChange={(e) => set("q")(e.target.value)}
            placeholder="Nom, spécialité, mot-clé"
            className="h-12 rounded-full border-border bg-card pl-11 pr-5"
          />
        </div>
        <Select value={form.sort || "pertinence"} onValueChange={set("sort")}>
          <SelectTrigger className="h-12 w-full rounded-full bg-card px-5 sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pertinence">Pertinence</SelectItem>
            <SelectItem value="recent">Plus récents</SelectItem>
            <SelectItem value="populaire">Plus consultés</SelectItem>
          </SelectContent>
        </Select>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-card px-5 text-[13px] font-medium lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filtres
        </button>
        <button className="h-12 rounded-full bg-foreground px-7 text-[13px] font-medium text-background">
          Rechercher
        </button>
      </form>

      {chips.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <button
              key={chip.key}
              onClick={() => {
                const next = { ...search };
                delete next[chip.key];
                navigate({ to: "/recherche", search: next });
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-[11.5px] font-medium"
            >
              {chip.label} <X className="h-3 w-3" />
            </button>
          ))}
          <button onClick={reset} className="text-[11.5px] text-muted-foreground hover:text-foreground">
            Tout effacer
          </button>
        </div>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[270px_1fr] lg:gap-12">
        <aside className={cn("lg:block", open ? "block" : "hidden")}>
          <div className="space-y-5 rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-28">
            <p className="text-[12px] font-medium uppercase tracking-[0.16em]">Critères</p>

            <FilterSelect label="Pays" value={form.country} onChange={set("country")} options={facets.countries} placeholder="Tous les pays" />
            <FilterSelect label="Ville" value={form.city} onChange={set("city")} options={facets.cities} placeholder="Toutes les villes" />
            <FilterSelect label="Discipline" value={form.category} onChange={set("category")} options={facets.categories} placeholder="Toutes les disciplines" />
            <FilterSelect
              label="Disponibilité"
              value={form.availability}
              onChange={set("availability")}
              options={AVAILABILITY}
              placeholder="Toutes"
            />

            <div>
              <Label className="text-[12px] text-foreground/70">Spécialité</Label>
              <Input
                value={form.specialty || ""}
                onChange={(e) => set("specialty")(e.target.value)}
                placeholder="Ex. portrait documentaire"
                className="mt-1.5 h-10"
              />
            </div>

            <label className="flex cursor-pointer items-center gap-2.5">
              <Checkbox
                checked={Boolean(form.premiumOnly)}
                onCheckedChange={(v) => set("premiumOnly")(v ? true : undefined)}
              />
              <span className="text-[12.5px]">Profils Pro et Premium</span>
            </label>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => apply()}
                className="flex-1 rounded-full bg-foreground px-4 py-2.5 text-[12.5px] font-medium text-background"
              >
                Appliquer
              </button>
              <button
                type="button"
                onClick={reset}
                className="rounded-full border border-border px-4 py-2.5 text-[12.5px] font-medium"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </aside>

        <div>
          <p className="mb-5 text-[12.5px] text-muted-foreground">
            {total > 1 ? `${total} profils correspondent` : `${total} profil correspond`} à votre
            recherche.
          </p>

          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border px-6 py-20 text-center">
              <p className="text-[15px] font-medium">Aucun résultat</p>
              <p className="mt-2 text-[13px] text-muted-foreground">
                Élargissez un critère : le pays ou la disponibilité sont souvent les plus
                restrictifs.
              </p>
              <button
                onClick={reset}
                className="mt-6 rounded-full bg-foreground px-5 py-2.5 text-[12.5px] font-medium text-background"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
              {items.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} sponsored={artist.boosted} />
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