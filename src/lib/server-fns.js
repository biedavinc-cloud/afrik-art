import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";
import { BOOST_PACKAGES, DEFAULT_PLANS } from "@/lib/plans";

const asPage = (res) => (Array.isArray(res) ? res : res?.items || []);

async function loadRanked(api) {
  const [profilesRes, promosRes] = await Promise.all([
    api.entities.ArtistProfile.filter({ status: "active" }, { limit: 300, sort: "-created_date" }),
    api.entities.Promotion.filter({ status: "active" }, { limit: 300 }),
  ]);

  const now = Date.now();
  const promos = new Map(
    asPage(promosRes)
      .filter((p) => new Date(p.ends_at || 0).getTime() > now)
      .map((p) => [p.profile_id, p])
  );

  return asPage(profilesRes)
    .filter((p) => p.is_published !== false)
    .map((p) => ({
    ...p,
    boosted: promos.has(p.id),
    promotion_ends_at: promos.get(p.id)?.ends_at || null,
  }));
}

// Prestataire de paiement actif : celui marqué par défaut, sinon le premier actif.
async function activePaymentProvider(svc) {
  const rows = asPage(
    await svc.entities.Integration.filter({ kind: "payment", enabled: true }, { limit: 20 })
  );
  return rows.find((r) => r.is_default) || rows[0] || null;
}

function score(profile, q) {
  let s = 0;
  if (profile.plan === "premium") s += 30;
  else if (profile.plan === "pro") s += 15;
  if (profile.boosted) s += 120;
  if (profile.verified) s += 10;
  s += Math.min(profile.views || 0, 600) / 25;
  const filled = [
    profile.bio,
    profile.avatar_url,
    profile.cover_url,
    profile.city,
    profile.country,
    profile.website,
    profile.specialty,
  ].filter(Boolean).length;
  s += filled * 2;
  if (q) {
    const hay = [
      profile.display_name,
      profile.tagline,
      profile.bio,
      profile.specialty,
      profile.primary_category,
      profile.city,
      profile.country,
      ...(profile.categories || []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    if (hay.includes(q)) s += 80;
  }
  return s;
}

export const getHomeData = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  const api = context.getApi();
  const [profiles, categoriesRes, plansRes] = await Promise.all([
    loadRanked(api),
    api.entities.Category.list({ sort: "sort", limit: 60 }),
    api.entities.PlanConfig.list({ sort: "sort", limit: 20 }),
  ]);

  const categories = asPage(categoriesRes).filter((c) => c.active !== false);
  const plans = asPage(plansRes)
    .filter((p) => p.active !== false)
    .map((p) => ({
      key: p.key,
      name: p.name,
      price: p.price,
      tagline: p.tagline,
      mediaLimit: p.media_limit,
      categoriesLimit: p.categories_limit,
      features: p.features || [],
      badge: p.key === "starter" ? null : p.name,
    }));
  const ranked = [...profiles].sort(
    (a, b) => score(b, "") - score(a, "") || new Date(b.created_date) - new Date(a.created_date)
  );

  const countries = Object.entries(
    profiles.reduce((acc, p) => {
      if (!p.country) return acc;
      acc[p.country] = (acc[p.country] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return {
    featured: ranked.slice(0, 8),
    sponsored: ranked.filter((p) => p.boosted).slice(0, 4),
    recent: [...profiles]
      .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
      .slice(0, 8),
    categories,
    countries,
    plans,
    totalArtists: profiles.length,
  };
});

// Données publiques des pages rendues côté serveur : le client api du
// navigateur n'est pas configuré pendant le rendu serveur, ces lectures
// doivent donc passer par une fonction serveur.
export const getPublicCategories = createServerFn({ method: "GET" }).handler(
  async ({ context }) => {
    const res = await context
      .getApi()
      .entities.Category.list({ sort: "sort", limit: 60 });
    return asPage(res).filter((c) => c.active !== false);
  }
);

export const getPublicPlans = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  const res = await context.getApi().entities.PlanConfig.list({ sort: "sort", limit: 20 });
  return asPage(res)
    .filter((p) => p.active !== false)
    .map((p) => ({
      key: p.key,
      name: p.name,
      price: p.price,
      tagline: p.tagline,
      mediaLimit: p.media_limit,
      categoriesLimit: p.categories_limit,
      features: p.features || [],
      badge: p.key === "starter" ? null : p.name,
    }));
});

export const searchArtists = createServerFn({ method: "GET" })
  .validator(
    z.object({
      q: z.string().max(120).optional(),
      country: z.string().max(80).optional(),
      city: z.string().max(80).optional(),
      category: z.string().max(80).optional(),
      specialty: z.string().max(120).optional(),
      availability: z.string().max(40).optional(),
      premiumOnly: z.boolean().optional(),
      sort: z.enum(["pertinence", "recent", "populaire"]).optional(),
    })
  )
  .handler(async ({ data, context }) => {
    const api = context.getApi();
    const all = await loadRanked(api);
    const q = (data.q || "").toLowerCase().trim();

    const filtered = all.filter((p) => {
      if (data.country && p.country !== data.country) return false;
      if (data.city && !(p.city || "").toLowerCase().includes(data.city.toLowerCase()))
        return false;
      if (
        data.category &&
        p.primary_category !== data.category &&
        !(p.categories || []).includes(data.category)
      )
        return false;
      if (
        data.specialty &&
        !(p.specialty || "").toLowerCase().includes(data.specialty.toLowerCase())
      )
        return false;
      if (data.availability && p.availability !== data.availability) return false;
      if (data.premiumOnly && p.plan === "starter") return false;
      if (q) {
        const hay = [
          p.display_name,
          p.tagline,
          p.bio,
          p.specialty,
          p.primary_category,
          p.city,
          p.country,
          ...(p.categories || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const sort = data.sort || "pertinence";
    const items = [...filtered].sort((a, b) => {
      if (sort === "recent") return new Date(b.created_date) - new Date(a.created_date);
      if (sort === "populaire") return (b.views || 0) - (a.views || 0);
      return score(b, q) - score(a, q);
    });

    return {
      items,
      total: items.length,
      facets: {
        countries: [...new Set(all.map((p) => p.country).filter(Boolean))].sort(),
        cities: [...new Set(all.map((p) => p.city).filter(Boolean))].sort(),
        categories: [...new Set(all.map((p) => p.primary_category).filter(Boolean))].sort(),
      },
    };
  });

export const getPublicProfile = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string().max(120) }))
  .handler(async ({ data, context }) => {
    const api = context.getApi();
    const found = asPage(await api.entities.ArtistProfile.filter({ slug: data.slug }, { limit: 1 }));
    const profile = found[0];
    if (!profile) return null;

    const [artworks, promos] = await Promise.all([
      api.entities.Artwork.filter({ profile_id: profile.id }, { limit: 100, sort: "sort" }),
      api.entities.Promotion.filter({ profile_id: profile.id, status: "active" }, { limit: 5 }),
    ]);

    const activePromo = asPage(promos).find(
      (p) => new Date(p.ends_at || 0).getTime() > Date.now()
    );

    return {
      profile,
      artworks: asPage(artworks),
      boosted: Boolean(activePromo),
    };
  });

export const recordProfileView = createServerFn({ method: "POST" })
  .validator(z.object({ profileId: z.string().max(80) }))
  .handler(async ({ data, context }) => {
    const api = context.getApi().asServiceRole;
    const profile = await api.entities.ArtistProfile.get(data.profileId);
    await api.entities.ArtistProfile.update(data.profileId, {
      views: (profile.views || 0) + 1,
    });

    const promos = asPage(
      await api.entities.Promotion.filter(
        { profile_id: data.profileId, status: "active" },
        { limit: 5 }
      )
    );
    const current = promos.find((p) => new Date(p.ends_at || 0).getTime() > Date.now());
    if (current) {
      await api.entities.Promotion.update(current.id, {
        visits: (current.visits || 0) + 1,
      });
    }
    return { ok: true };
  });

export const trackPromotionEvent = createServerFn({ method: "POST" })
  .validator(
    z.object({
      promotionId: z.string().max(80),
      type: z.enum(["impression", "click"]),
    })
  )
  .handler(async ({ data, context }) => {
    const api = context.getApi().asServiceRole;
    const promo = await api.entities.Promotion.get(data.promotionId);
    const field = data.type === "click" ? "clicks" : "impressions";
    await api.entities.Promotion.update(promo.id, {
      [field]: (promo[field] || 0) + 1,
    });
    return { ok: true };
  });

export const sendContactRequest = createServerFn({ method: "POST" })
  .validator(
    z.object({
      profileId: z.string().max(80),
      senderName: z.string().min(2).max(120),
      senderEmail: z.string().email().max(160),
      subject: z.string().max(160).optional(),
      message: z.string().min(15).max(4000),
      collaborationType: z
        .enum(["exposition", "achat", "commande", "presse", "collaboration", "autre"])
        .optional(),
    })
  )
  .handler(async ({ data, context }) => {
    const api = context.getApi();
    const profile = await api.entities.ArtistProfile.get(data.profileId);

    await api.entities.ContactRequest.create({
      profile_id: profile.id,
      artist_user_id: profile.user_id || "",
      artist_name: profile.display_name,
      sender_name: data.senderName,
      sender_email: data.senderEmail,
      subject: data.subject || "Nouvelle demande de contact",
      message: data.message,
      collaboration_type: data.collaborationType || "collaboration",
      status: "new",
    });

    return { ok: true };
  });

export const requestSubscription = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ plan: z.enum(["starter", "pro", "premium"]) }))
  .handler(async ({ data, context }) => {
    const api = context.getApi();
    const user = context.user;

    const profiles = asPage(
      await api.entities.ArtistProfile.filter({ user_id: user.id }, { limit: 1 })
    );
    const profile = profiles[0];
    if (!profile) throw new Error("Profil artiste introuvable.");

    const configs = asPage(await api.entities.PlanConfig.list({ limit: 20 }));
    const fallback = DEFAULT_PLANS.find((p) => p.key === data.plan);
    const config = configs.find((c) => c.key === data.plan);
    const price = Number(config?.price ?? fallback?.price ?? 0);

    if (price === 0) {
      await api.entities.ArtistProfile.update(profile.id, {
        plan: "starter",
        plan_status: "active",
        plan_ends_at: "",
      });
      return { immediate: true, plan: data.plan };
    }

    const sub = await api.entities.Subscription.create({
      profile_id: profile.id,
      plan: data.plan,
      price,
      status: "pending",
    });

    const psp = await activePaymentProvider(context.getApi().asServiceRole);

    await api.entities.Payment.create({
      owner_email: user.email,
      type: "subscription",
      label: `Abonnement ${config?.name || data.plan} — 1 mois`,
      reference_id: sub.id,
      provider: psp?.provider || "",
      amount: price,
      currency: "USD",
      status: "pending",
    });

    return { immediate: false, plan: data.plan, price, provider: psp?.display_name || null };
  });

export const requestBoost = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({
      profileId: z.string().max(80),
      hours: z.union([z.literal(24), z.literal(72), z.literal(168), z.literal(720)]),
      countries: z.array(z.string().max(80)).max(60).optional(),
      categories: z.array(z.string().max(80)).max(20).optional(),
    })
  )
  .handler(async ({ data, context }) => {
    const api = context.getApi();
    const user = context.user;
    const profile = await api.entities.ArtistProfile.get(data.profileId);
    if (profile.user_id !== user.id) throw new Error("Ce profil ne vous appartient pas.");

    const pack = BOOST_PACKAGES.find((p) => p.hours === data.hours);
    if (!pack) throw new Error("Durée de mise en avant invalide.");

    const promo = await api.entities.Promotion.create({
      profile_id: profile.id,
      artist_name: profile.display_name,
      duration_hours: pack.hours,
      duration_label: pack.label,
      price: pack.price,
      target_countries: data.countries || [],
      target_categories: data.categories || [],
      status: "pending",
      impressions: 0,
      clicks: 0,
      visits: 0,
    });

    const psp = await activePaymentProvider(context.getApi().asServiceRole);

    await api.entities.Payment.create({
      owner_email: user.email,
      type: "boost",
      label: `Mise en avant ${pack.label}`,
      reference_id: promo.id,
      provider: psp?.provider || "",
      amount: pack.price,
      currency: "USD",
      status: "pending",
    });

    return { ok: true, price: pack.price, provider: psp?.display_name || null };
  });

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    if (context.user.role !== "admin") throw new Error("Accès réservé à l'administration.");
    const api = context.getApi();

    const [profiles, artworks, payments, subs, promos, reports, users] = await Promise.all([
      api.entities.ArtistProfile.list({ limit: 500 }),
      api.entities.Artwork.list({ limit: 1000 }),
      api.entities.Payment.list({ limit: 1000 }),
      api.entities.Subscription.list({ limit: 500 }),
      api.entities.Promotion.list({ limit: 500 }),
      api.entities.Report.list({ limit: 200 }),
      api.entities.User.list({ limit: 500 }),
    ]);

    const profileList = asPage(profiles);
    const paymentList = asPage(payments);

    return {
      artists: profileList.length,
      activeArtists: profileList.filter((p) => p.status === "active").length,
      suspended: profileList.filter((p) => p.status === "suspended").length,
      verified: profileList.filter((p) => p.verified).length,
      users: asPage(users).length,
      artworks: asPage(artworks).length,
      revenue: paymentList
        .filter((p) => p.status === "paid")
        .reduce((sum, p) => sum + (p.amount || 0), 0),
      pendingPayments: paymentList.filter((p) => p.status === "pending").length,
      pendingSubscriptions: asPage(subs).filter((s) => s.status === "pending").length,
      pendingPromotions: asPage(promos).filter((p) => p.status === "pending").length,
      activePromotions: asPage(promos).filter((p) => p.status === "active").length,
      openReports: asPage(reports).filter((r) => r.status === "open").length,
      byPlan: {
        starter: profileList.filter((p) => p.plan === "starter").length,
        pro: profileList.filter((p) => p.plan === "pro").length,
        premium: profileList.filter((p) => p.plan === "premium").length,
      },
      byCountry: Object.entries(
        profileList.reduce((acc, p) => {
          if (p.country) acc[p.country] = (acc[p.country] || 0) + 1;
          return acc;
        }, {})
      )
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8),
    };
  });