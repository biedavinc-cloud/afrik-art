import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES } from "@/lib/slug";

const AVAILABILITY = [
  { value: "available", label: "Disponible pour des projets" },
  { value: "open_to_collab", label: "Ouvert aux collaborations" },
  { value: "busy", label: "Agenda chargé" },
];

export default function ProfileFields({ form, setForm, categories, maxCategories = 1 }) {
  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e?.target ? e.target.value : e }));

  const toggleCategory = (name) => {
    setForm((f) => {
      const current = f.categories || [];
      if (current.includes(name)) {
        return { ...f, categories: current.filter((c) => c !== name) };
      }
      if (current.length >= maxCategories) return f;
      return { ...f, categories: [...current, name] };
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="p-name">Nom ou pseudonyme *</Label>
          <Input
            id="p-name"
            required
            value={form.display_name || ""}
            onChange={set("display_name")}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="p-specialty">Spécialité</Label>
          <Input
            id="p-specialty"
            value={form.specialty || ""}
            onChange={set("specialty")}
            placeholder="Ex. portrait documentaire"
            className="mt-1.5"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="p-tagline">Phrase de présentation</Label>
        <Input
          id="p-tagline"
          value={form.tagline || ""}
          onChange={set("tagline")}
          maxLength={120}
          placeholder="Une phrase qui résume votre travail"
          className="mt-1.5"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Catégorie principale *</Label>
          <Select value={form.primary_category || ""} onValueChange={set("primary_category")}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Choisir une discipline" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.name} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Disponibilité</Label>
          <Select value={form.availability || "available"} onValueChange={set("availability")}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AVAILABILITY.map((a) => (
                <SelectItem key={a.value} value={a.value}>
                  {a.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Pays *</Label>
          <Select value={form.country || ""} onValueChange={set("country")}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Choisir un pays" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {COUNTRIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="p-city">Ville *</Label>
          <Input
            id="p-city"
            required
            value={form.city || ""}
            onChange={set("city")}
            className="mt-1.5"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="p-bio">Biographie</Label>
        <Textarea
          id="p-bio"
          rows={6}
          value={form.bio || ""}
          onChange={set("bio")}
          placeholder="Votre parcours, votre démarche, vos références…"
          className="mt-1.5"
        />
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          {(form.bio || "").length} caractères. Une biographie complète améliore votre
          positionnement dans les recherches.
        </p>
      </div>

      <div>
        <Label>
          Catégories secondaires{" "}
          <span className="font-normal text-muted-foreground">
            ({(form.categories || []).length}/{maxCategories})
          </span>
        </Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {categories
            .filter((c) => c.name !== form.primary_category)
            .map((c) => {
              const active = (form.categories || []).includes(c.name);
              const disabled = !active && (form.categories || []).length >= maxCategories;
              return (
                <button
                  key={c.name}
                  type="button"
                  disabled={disabled}
                  onClick={() => toggleCategory(c.name)}
                  className={`rounded-full border px-3 py-1.5 text-[12px] transition-colors ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-foreground/70 hover:border-foreground/30"
                  } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
                >
                  {c.name}
                </button>
              );
            })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="p-web">Site internet</Label>
          <Input id="p-web" value={form.website || ""} onChange={set("website")} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="p-insta">Instagram</Label>
          <Input id="p-insta" value={form.instagram || ""} onChange={set("instagram")} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="p-behance">Behance</Label>
          <Input id="p-behance" value={form.behance || ""} onChange={set("behance")} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="p-yt">YouTube</Label>
          <Input id="p-yt" value={form.youtube || ""} onChange={set("youtube")} className="mt-1.5" />
        </div>
      </div>

      <div>
        <Label htmlFor="p-mail">E-mail de contact (privé, optionnel)</Label>
        <Input
          id="p-mail"
          type="email"
          value={form.contact_email || ""}
          onChange={set("contact_email")}
          placeholder="Jamais affiché publiquement : les visiteurs vous écrivent via la messagerie"
          className="mt-1.5"
        />
      </div>
    </div>
  );
}