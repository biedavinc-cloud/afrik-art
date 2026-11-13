import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { importRecords, loadExamplePosts, removeExamplePosts } from "@/lib/admin-fns";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authed/admin/import")({
  head: () => ({ meta: [{ title: "Import de données | Afrik Art" }] }),
  component: AdminImport,
});

const ENTITIES = [
  { value: "BlogPost", label: "Articles du journal", hint: "title, slug, content, category, status, excerpt, cover_url, tags…" },
  { value: "Category", label: "Catégories", hint: "name, slug, description, icon, sort, active" },
  { value: "PlanConfig", label: "Plans tarifaires", hint: "export de l'entité PlanConfig" },
  { value: "ArtistProfile", label: "Profils d'artistes", hint: "Les profils importés ne sont pas rattachés à un compte : l'artiste devra être relié par un admin." },
  { value: "Artwork", label: "Œuvres", hint: "export de l'entité Artwork" },
];

const CHUNK = 50;

// CSV (RFC 4180) : guillemets, virgules et retours à la ligne dans les champs, séparateur , ou ;
function parseCsv(text) {
  const clean = text.replace(/^\uFEFF/, "");
  const sep = (clean.split("\n", 1)[0].match(/;/g) || []).length > (clean.split("\n", 1)[0].match(/,/g) || []).length ? ";" : ",";
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];
    if (quoted) {
      if (c === '"' && clean[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === sep) {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && clean[i + 1] === "\n") i++;
      row.push(cell);
      cell = "";
      if (row.some((v) => v !== "")) rows.push(row);
      row = [];
    } else cell += c;
  }
  row.push(cell);
  if (row.some((v) => v !== "")) rows.push(row);
  const [header, ...body] = rows;
  if (!header) return [];
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), r[i] ?? ""])));
}

function parseFile(name, text) {
  if (name.toLowerCase().endsWith(".csv")) return parseCsv(text);
  const data = JSON.parse(text);
  const list = Array.isArray(data) ? data : data?.records || data?.items || data?.data;
  if (!Array.isArray(list)) throw new Error("Le fichier JSON doit contenir une liste d'enregistrements.");
  return list;
}

function AdminImport() {
  const [entity, setEntity] = useState("BlogPost");
  const [records, setRecords] = useState([]);
  const [fileName, setFileName] = useState("");
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState(null);
  const current = ENTITIES.find((e) => e.value === entity);
  const [exampleBusy, setExampleBusy] = useState(false);

  async function examples(action) {
    setExampleBusy(true);
    try {
      if (action === "load") {
        const result = await loadExamplePosts();
        toast.success(`${result.imported} article(s) d'exemple chargé(s) dans le journal.`);
      } else {
        const result = await removeExamplePosts();
        toast.success(`${result.removed} article(s) d'exemple supprimé(s).`);
      }
    } catch (error) {
      toast.error(error.message || "Action impossible.");
    } finally {
      setExampleBusy(false);
    }
  }

  async function onFile(event) {
    const file = event.target.files?.[0];
    setReport(null);
    if (!file) return;
    try {
      const parsed = parseFile(file.name, await file.text());
      if (parsed.length === 0) throw new Error("Aucun enregistrement trouvé dans le fichier.");
      setRecords(parsed);
      setFileName(file.name);
    } catch (error) {
      setRecords([]);
      setFileName("");
      toast.error(error.message || "Fichier illisible.");
    }
  }

  async function run() {
    setBusy(true);
    const total = { imported: 0, skipped: [] };
    try {
      for (let i = 0; i < records.length; i += CHUNK) {
        const result = await importRecords({ data: { entity, records: records.slice(i, i + CHUNK) } });
        total.imported += result.imported;
        total.skipped.push(...result.skipped.map((s) => ({ ...s, index: s.index + i })));
      }
      setReport(total);
      toast.success(`${total.imported} enregistrement(s) importé(s).`);
    } catch (error) {
      toast.error(error.message || "Import impossible.");
    } finally {
      setBusy(false);
    }
  }

  const preview = records.slice(0, 5).map((r) => r.title || r.name || r.display_name || r.slug || r.id || "—");

  return (
    <div className="max-w-3xl">
      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Superadmin</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Import de données</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Réalimentez la plateforme à partir d'un export (JSON ou CSV) : articles du journal, catégories, profils… Les
        identifiants, dates et liens d'origine sont conservés ; relancer un import met à jour sans créer de doublons.
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">Articles d'exemple</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Remplissez le journal avec 6 articles d'art illustrés (conseils, marché de l'art, culture). Ils portent le badge
          « Rédaction », se rechargent sans doublon et se suppriment en un clic.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => examples("load")}
            disabled={exampleBusy}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {exampleBusy && <Loader2 className="h-4 w-4 animate-spin" />}
            Charger les articles d'exemple
          </button>
          <button
            type="button"
            onClick={() => examples("remove")}
            disabled={exampleBusy}
            className="inline-flex h-11 items-center rounded-full border border-border px-6 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-50"
          >
            Supprimer les exemples
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-6 rounded-2xl border border-border bg-card p-6">
        <div>
          <Label htmlFor="import-entity">Type de contenu</Label>
          <select
            id="import-entity"
            value={entity}
            onChange={(e) => {
              setEntity(e.target.value);
              setReport(null);
            }}
            className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {ENTITIES.map((e) => (
              <option key={e.value} value={e.value}>
                {e.label}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-muted-foreground">Champs attendus : {current.hint}</p>
        </div>

        <div>
          <Label htmlFor="import-file">Fichier d'export (.json ou .csv)</Label>
          <label
            htmlFor="import-file"
            className="mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border px-4 py-5 text-sm text-muted-foreground transition-colors hover:border-foreground/40"
          >
            <FileUp className="h-5 w-5" />
            {fileName || "Choisir un fichier…"}
          </label>
          <input id="import-file" type="file" accept=".json,.csv,application/json,text/csv" className="sr-only" onChange={onFile} />
        </div>

        {records.length > 0 && (
          <div className="rounded-xl bg-muted/50 p-4 text-sm">
            <p className="font-medium">
              {records.length} enregistrement(s) prêt(s) à importer
            </p>
            <ul className="mt-2 list-disc space-y-0.5 pl-5 text-muted-foreground">
              {preview.map((p, i) => (
                <li key={i} className="truncate">
                  {String(p)}
                </li>
              ))}
              {records.length > preview.length && <li>… et {records.length - preview.length} autre(s)</li>}
            </ul>
          </div>
        )}

        <button
          type="button"
          onClick={run}
          disabled={busy || records.length === 0}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          Importer
        </button>
      </div>

      {report && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-6 text-sm">
          <p className="font-medium">{report.imported} importé(s)</p>
          {report.skipped.length > 0 && (
            <>
              <p className="mt-3 font-medium text-destructive">{report.skipped.length} ligne(s) ignorée(s)</p>
              <ul className="mt-2 max-h-56 list-disc space-y-0.5 overflow-auto pl-5 text-muted-foreground">
                {report.skipped.slice(0, 50).map((s, i) => (
                  <li key={i}>
                    Ligne {s.index} : {s.reason}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
