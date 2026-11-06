import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { slugify } from "@/lib/slug";

export const Route = createFileRoute("/_authed/admin/categories")({
  component: AdminCategories,
});

function AdminCategories() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "", icon: "sparkles" });

  const load = useCallback(async () => {
    const res = await base44.entities.Category.list({ sort: "sort", limit: 100 });
    setItems(Array.isArray(res) ? res : res?.items || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function create(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    try {
      await base44.entities.Category.create({
        name: form.name.trim(),
        slug: slugify(form.name),
        description: form.description,
        icon: form.icon || "sparkles",
        sort: items.length + 1,
        active: true,
      });
      setForm({ name: "", description: "", icon: "sparkles" });
      await load();
      toast.success("Catégorie ajoutée.");
    } catch (err) {
      toast.error(err.message || "Ajout impossible.");
    }
  }

  async function toggle(item) {
    await base44.entities.Category.update(item.id, { active: !item.active });
    setItems((all) => all.map((c) => (c.id === item.id ? { ...c, active: !c.active } : c)));
  }

  async function remove(item) {
    if (!window.confirm(`Supprimer la catégorie « ${item.name} » ?`)) return;
    await base44.entities.Category.delete(item.id);
    setItems((all) => all.filter((c) => c.id !== item.id));
    toast.success("Catégorie supprimée.");
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="label-caps">Catalogue</p>
        <h1 className="mt-2 text-2xl font-semibold">Catégories</h1>
        <p className="mt-1.5 text-[12.5px] text-muted-foreground">
          Les disciplines proposées aux artistes lors de la création de leur profil.
        </p>
      </div>

      <form onSubmit={create} className="rounded-xl border border-border bg-background p-5">
        <p className="text-[13px] font-medium">Ajouter une discipline</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1.6fr_auto]">
          <div>
            <Label className="text-[11px] text-muted-foreground">Nom</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1 h-10"
            />
          </div>
          <div>
            <Label className="text-[11px] text-muted-foreground">Description</Label>
            <Input
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="mt-1 h-10"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="inline-flex h-10 items-center gap-1.5 rounded-full bg-foreground px-5 text-[12px] font-medium text-background"
            >
              <Plus className="h-3.5 w-3.5" /> Ajouter
            </button>
          </div>
        </div>
      </form>

      <div className="overflow-hidden rounded-xl border border-border bg-background">
        <div className="divide-y divide-border">
          {items.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
              <div>
                <p className="text-[12.5px] font-medium">{c.name}</p>
                <p className="text-[11px] text-muted-foreground">{c.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggle(c)}
                  className={`rounded-full px-3 py-1 text-[11px] ${
                    c.active ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {c.active ? "Active" : "Masquée"}
                </button>
                <button
                  onClick={() => remove(c)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-destructive hover:bg-destructive/10"
                  aria-label="Supprimer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}