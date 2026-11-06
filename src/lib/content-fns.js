import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";

const asItems = (res) => (Array.isArray(res) ? res : res?.items || []);

function toSlug(value) {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || `article-${Date.now()}`;
}

const POST_INPUT = z.object({
  id: z.string().max(80).optional(),
  title: z.string().min(3).max(160),
  excerpt: z.string().max(300).optional(),
  content: z.string().min(20).max(30000),
  cover_url: z.string().max(500).optional(),
  category: z.string().max(60).optional(),
  status: z.enum(["draft", "published"]).optional(),
});

// ---------- Blog ----------

export const listBlogPosts = createServerFn({ method: "GET" })
  .validator(
    z.object({
      q: z.string().max(120).optional(),
      category: z.string().max(60).optional(),
      limit: z.number().max(60).optional(),
    })
  )
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const res = await base44.entities.BlogPost.filter(
      { status: "published" },
      { sort: "-published_at", limit: data.limit || 40 }
    );
    const q = (data.q || "").toLowerCase().trim();
    const items = asItems(res).filter((p) => {
      if (data.category && p.category !== data.category) return false;
      if (!q) return true;
      return [p.title, p.excerpt, p.content, p.author_name, p.category]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
    const all = asItems(res);
    return {
      items,
      total: items.length,
      categories: [...new Set(all.map((p) => p.category).filter(Boolean))].sort(),
    };
  });

export const getBlogPost = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string().max(120) }))
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const found = asItems(
      await base44.entities.BlogPost.filter({ slug: data.slug }, { limit: 1 })
    );
    const post = found[0];
    if (!post) return null;
    const related = asItems(
      await base44.entities.BlogPost.filter({ status: "published" }, { sort: "-published_at", limit: 4 })
    ).filter((p) => p.id !== post.id);
    return { post, related: related.slice(0, 3) };
  });

export const myBlogPosts = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    const base44 = context.getBase44();
    const res = await base44.entities.BlogPost.filter(
      { author_user_id: context.user.id },
      { sort: "-created_date", limit: 100 }
    );
    return { items: asItems(res) };
  });

export const saveBlogPost = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(POST_INPUT)
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const profiles = asItems(
      await base44.entities.ArtistProfile.filter({ user_id: context.user.id }, { limit: 1 })
    );
    const profile = profiles[0];

    const base = {
      title: data.title,
      excerpt: data.excerpt || data.content.slice(0, 160),
      content: data.content,
      cover_url: data.cover_url || "",
      category: data.category || "Culture",
      status: data.status || "draft",
      author_user_id: context.user.id,
      author_profile_id: profile?.id || "",
      author_name: profile?.display_name || context.user.full_name || "Équipe Afrik Art",
      author_slug: profile?.slug || "",
    };

    if (data.id) {
      const existing = await base44.entities.BlogPost.get(data.id);
      if (existing.author_user_id !== context.user.id && context.user.role !== "admin") {
        throw new Error("Cet article ne vous appartient pas.");
      }
      const updated = await base44.entities.BlogPost.update(data.id, {
        ...base,
        ...(base.status === "published" && !existing.published_at
          ? { published_at: new Date().toISOString() }
          : {}),
      });
      return { ok: true, post: updated };
    }

    const created = await base44.entities.BlogPost.create({
      ...base,
      slug: `${toSlug(data.title)}-${Math.random().toString(36).slice(2, 6)}`,
      published_at: base.status === "published" ? new Date().toISOString() : "",
      views: 0,
    });
    return { ok: true, post: created };
  });

export const deleteBlogPost = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ id: z.string().max(80) }))
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const post = await base44.entities.BlogPost.get(data.id);
    if (post.author_user_id !== context.user.id && context.user.role !== "admin") {
      throw new Error("Cet article ne vous appartient pas.");
    }
    await base44.entities.BlogPost.delete(post.id);
    return { ok: true };
  });

// ---------- Galerie publique ----------

export const listGallery = createServerFn({ method: "GET" })
  .validator(
    z.object({
      q: z.string().max(120).optional(),
      category: z.string().max(80).optional(),
      media: z.enum(["all", "photo", "video"]).optional(),
      limit: z.number().max(120).optional(),
    })
  )
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const [artworksRes, profilesRes] = await Promise.all([
      base44.entities.Artwork.list({ sort: "-created_date", limit: data.limit || 90 }),
      base44.entities.ArtistProfile.filter({ status: "active" }, { limit: 300 }),
    ]);
    const profiles = new Map(
      asItems(profilesRes)
        .filter((p) => p.is_published !== false)
        .map((p) => [p.id, p])
    );

    const q = (data.q || "").toLowerCase().trim();
    const items = asItems(artworksRes)
      .filter((a) => profiles.has(a.profile_id))
      .filter((a) => (data.media && data.media !== "all" ? a.media_type === data.media : true))
      .filter((a) => (data.category ? a.category === data.category : true))
      .filter((a) => {
        if (!q) return true;
        const artist = profiles.get(a.profile_id);
        return [a.title, a.description, a.category, artist?.display_name, artist?.country]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q);
      })
      .map((a) => {
        const artist = profiles.get(a.profile_id);
        return {
          ...a,
          artist_name: artist?.display_name || "Artiste",
          artist_slug: artist?.slug || "",
          artist_country: artist?.country || "",
        };
      });

    const all = asItems(artworksRes).filter((a) => profiles.has(a.profile_id));
    return {
      items,
      total: items.length,
      categories: [...new Set(all.map((a) => a.category).filter(Boolean))].sort(),
    };
  });

// ---------- Classement ----------

export const getTopArtists = createServerFn({ method: "GET" })
  .validator(z.object({ sort: z.enum(["views", "complete", "recent"]).optional() }))
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const res = await base44.entities.ArtistProfile.filter(
      { status: "active" },
      { limit: 300 }
    );
    const profiles = asItems(res).filter((p) => p.is_published !== false);

    const completeness = (p) =>
      [p.bio, p.avatar_url, p.cover_url, p.city, p.country, p.website, p.specialty].filter(Boolean)
        .length;

    const ranked = [...profiles].sort((a, b) => {
      if (data.sort === "complete") return completeness(b) - completeness(a);
      if (data.sort === "recent") return new Date(b.created_date) - new Date(a.created_date);
      return (b.views || 0) - (a.views || 0);
    });

    return {
      items: ranked.slice(0, 30).map((p, index) => ({
        ...p,
        rank: index + 1,
        completeness: completeness(p),
      })),
      total: profiles.length,
    };
  });

// ---------- Support ----------

export const createSupportTicket = createServerFn({ method: "POST" })
  .validator(
    z.object({
      name: z.string().min(2).max(120),
      email: z.string().email().max(160),
      category: z
        .enum(["compte", "abonnement", "paiement", "technique", "autre"])
        .optional(),
      subject: z.string().max(160).optional(),
      message: z.string().min(10).max(4000),
    })
  )
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44().asServiceRole;
    await base44.entities.SupportTicket.create({
      name: data.name,
      email: data.email,
      category: data.category || "autre",
      subject: data.subject || "Demande d'assistance",
      message: data.message,
      status: "open",
    });
    return { ok: true };
  });

// ---------- Factures ----------

export const listMyInvoices = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    const base44 = context.getBase44();
    const res = await base44.entities.Payment.filter(
      { owner_email: context.user.email },
      { sort: "-created_date", limit: 200 }
    );
    return { items: asItems(res), email: context.user.email };
  });