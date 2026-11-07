import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  PenLine,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminListBlogPosts, deleteBlogPost, saveBlogPost } from "@/lib/content-fns";

export const Route = createFileRoute("/_authed/admin/blog")({
  head: () => ({ meta: [{ title: "Journal — Superadmin | Afrik Art" }] }),
  component: AdminBlogPage,
});

const CATEGORIES = [
  "Culture",
  "Portrait",
  "Marché de l'art",
  "Conseils",
  "Reportage",
  "Voyage",
  "Tech & innovation",
  "Écosystème Liafrik",
  "Coulisses de la plateforme",
];

const EMPTY = {
  title: "",
  category: "Culture",
  cover_url: "",
  excerpt: "",
  content: "",
  status: "draft",
  author_name: "",
  editorial: true,
};

function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  async function load(q = "") {
    const res = await adminListBlogPosts({ data: { q } });
    setPosts(res.items || []);
    setLoading(false);
  }

  useEffect(() => {
    load().catch(() => {
      setLoading(false);
      toast.error("Impossible de charger le journal.");
    });
  }, []);

  function startNew() {
    setEditing("new");
    setForm(EMPTY);
  }

  function startEdit(post) {
    setEditing(post.id);
    setForm({
      title: post.title || "",
      category: post.category || "Culture",
      cover_url: post.cover_url || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      status: post.status || "draft",
      author_name: post.author_name || "",
      editorial: Boolean(post.editorial),
    });
  }

  async function save(status) {
    if (form.title.trim().length < 3 || form.content.trim().length < 20) {
      toast.error("Ajoutez un titre et au moins quelques lignes de texte.");
      return;
    }
    setSaving(true);
    try {
      await saveBlogPost({
        data: { ...form, status: status || form.status, id: editing === "new" ? undefined : editing },
      });
      toast.success(status === "published" ? "Article publié." : "Article enregistré.");
      setEditing(null);
      await load(query);
    } catch (err) {
      toast.error(err.message || "L'enregistrement a échoué.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(post) {
    try {
      await deleteBlogPost({ data: { id: post.id } });
      setPosts((all) => all.filter((p) => p.id !== post.id));
      setConfirmId(null);
      toast.success("Article supprimé.");
    } catch (err) {
      toast.error(err.message || "Suppression impossible.");
    }
  }

  if (editing) {
    return (
      <div className="fade-up space-y-6">
        <button
          onClick={() => setEditing(null)}
          className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Journal
        </button>

        <div>
          <p className="label-caps">Rédaction officielle</p>
          <h1 className="mt-2 text-2xl font-semibold">
            {editing === "new" ? "Nouvel article" : "Modifier l'article"}
          </h1>
          <p className="mt-1.5 text-[12.5px] text-muted-foreground">
            Publiez depuis le Superadmin, y compris les articles signés par la rédaction.
          </p>
        </div>

        <div className="space-y-4 rounded-2xl border border-border bg-background p-6">
          <div>
            <Label htmlFor="ab-title">Titre</Label>
            <Input
              id="ab-title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ce que la lumière de Lomé m'a appris"
              className="mt-1.5"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Rubrique</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="ab-cover">Image de couverture (URL)</Label>
              <Input
                id="ab-cover"
                value={form.cover_url}
                onChange={(e) => setForm({ ...form, cover_url: e.target.value })}
                placeholder="https://…"
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="ab-author">Auteur affiché</Label>
              <Input
                id="ab-author"
                value={form.author_name}
                onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                placeholder="La rédaction Afrik Art"
                className="mt-1.5"
              />
            </div>
            <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-secondary/40 px-4 py-3">
              <div>
                <p className="text-[12.5px] font-medium">Article officiel</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Signalé « Rédaction » sur le journal.
                </p>
              </div>
              <Switch
                checked={form.editorial}
                onCheckedChange={(v) => setForm({ ...form, editorial: v })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="ab-excerpt">Chapô</Label>
            <Textarea
              id="ab-excerpt"
              rows={2}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="mt-1.5 resize-none"
            />
          </div>

          <div>
            <Label htmlFor="ab-content">Texte de l'article</Label>
            <Textarea
              id="ab-content"
              rows={16}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder={"Commencez à écrire…\n\nUtilisez « ## » pour un intertitre et « - » pour une liste."}
              className="mt-1.5"
            />
            <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3 w-3 text-accent" />
              Modération automatique : les textes liés aux drogues, à la violence ou à la fraude
              sont refusés et l'article est retiré du journal.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-border pt-4">
            <button
              onClick={() => save("published")}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[12.5px] font-medium text-background disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
              Publier
            </button>
            <button
              onClick={() => save("draft")}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[12.5px] font-medium disabled:opacity-60"
            >
              <EyeOff className="h-4 w-4" /> Brouillon
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-up space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label-caps">Contenu</p>
          <h1 className="mt-2 text-2xl font-semibold">Journal</h1>
          <p className="mt-1.5 text-[12.5px] text-muted-foreground">
            Tous les articles, y compris ceux écrits par les artistes Premium. Vous pouvez les
            modifier ou les supprimer.
          </p>
        </div>
        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[12.5px] font-medium text-background"
        >
          <Plus className="h-4 w-4" /> Écrire un article
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            load(e.target.value).catch(() => {});
          }}
          placeholder="Rechercher un article ou un auteur"
          className="h-10 pl-9"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-20 text-center">
          <PenLine className="mx-auto h-6 w-6 text-muted-foreground" />
          <p className="mt-4 text-[14px] font-medium">Aucun article.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-background px-5 py-4 transition-shadow hover:shadow-sm"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-[13.5px] font-medium">{post.title}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] ${
                      post.status === "published"
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {post.status === "published" ? "Publié" : "Brouillon"}
                  </span>
                  {post.editorial && (
                    <span className="rounded-full bg-foreground px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] text-background">
                      Rédaction
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[11.5px] text-muted-foreground">
                  {post.author_name || "Auteur inconnu"} · {post.category} · {post.views || 0} vues
                  {post.published_at
                    ? ` · ${new Date(post.published_at).toLocaleDateString("fr-FR")}`
                    : ""}
                </p>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => startEdit(post)}
                  className="rounded-full border border-border px-3.5 py-1.5 text-[11.5px] hover:bg-secondary"
                >
                  Modifier
                </button>
                {confirmId === post.id ? (
                  <button
                    onClick={() => remove(post)}
                    className="rounded-full bg-destructive px-3.5 py-1.5 text-[11.5px] font-medium text-destructive-foreground"
                  >
                    Confirmer
                  </button>
                ) : (
                  <button
                    onClick={() => setConfirmId(post.id)}
                    className="rounded-full border border-border px-2.5 py-1.5 text-muted-foreground hover:bg-secondary hover:text-destructive"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}