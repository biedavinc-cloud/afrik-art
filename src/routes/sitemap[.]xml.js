import { createFileRoute } from "@tanstack/react-router";
import { publicUrl } from "@/server/config.server";

// Plan du site pour les moteurs de recherche : pages publiques, profils d'artistes actifs et articles publiés.
// Les règles d'accès s'appliquent comme pour un visiteur : un profil suspendu ou un brouillon n'y figure jamais.
const STATIC_PAGES = ["/", "/explorer", "/galerie", "/actualites", "/top-artistes", "/categories", "/tarifs", "/guide-artiste", "/faq", "/support", "/ecosysteme"];

const xml = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]);
const day = (iso) => (iso && !Number.isNaN(Date.parse(iso)) ? new Date(iso).toISOString().slice(0, 10) : undefined);

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ context }) => {
        const base = publicUrl();
        const api = context.getApi();
        const [profiles, posts] = await Promise.all([
          api.entities.ArtistProfile.filter({}, "-updated_date", 5000).catch(() => []),
          api.entities.BlogPost.filter({ status: "published" }, "-published_at", 5000).catch(() => []),
        ]);
        const entries = [
          ...STATIC_PAGES.map((path) => ({ path, priority: path === "/" ? "1.0" : "0.7" })),
          ...profiles.filter((p) => p.slug).map((p) => ({ path: `/talents/${encodeURIComponent(p.slug)}`, lastmod: day(p.updated_date), priority: "0.8" })),
          ...posts.filter((p) => p.slug).map((p) => ({ path: `/actualites/${encodeURIComponent(p.slug)}`, lastmod: day(p.updated_date || p.published_at), priority: "0.6" })),
        ];
        const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
          .map((e) => `  <url><loc>${xml(base + e.path)}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ""}<priority>${e.priority}</priority></url>`)
          .join("\n")}\n</urlset>\n`;
        return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" } });
      },
    },
  },
});
