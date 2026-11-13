import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";
import { EXAMPLE_POSTS } from "@/server/example-posts";
import { sendTestEmail, systemStatus } from "@/server/system.server";

const asPage = (res) => (Array.isArray(res) ? res : res?.items || []);

function assertAdmin(context) {
  if (context.user?.role !== "admin") {
    throw new Error("Accès réservé au superadmin.");
  }
}

export const getSuperadminUsers = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    assertAdmin(context);
    const api = context.getApi();

    const [users, profilesRes] = await Promise.all([
      api.entities.User.list(),
      api.entities.ArtistProfile.list({ limit: 500 }),
    ]);

    const byUser = new Map(asPage(profilesRes).map((p) => [p.user_id, p]));

    const items = asPage(users).map((u) => {
      const profile = byUser.get(u.id);
      return {
        id: u.id,
        email: u.email,
        full_name: u.full_name || "",
        role: u.role || "user",
        created_date: u.created_date,
        profile: profile
          ? {
              id: profile.id,
              slug: profile.slug,
              display_name: profile.display_name,
              plan: profile.plan,
              status: profile.status,
              verified: Boolean(profile.verified),
            }
          : null,
      };
    });

    return {
      items,
      totals: {
        total: items.length,
        admins: items.filter((u) => u.role === "admin").length,
        artists: items.filter((u) => u.profile).length,
        withoutProfile: items.filter((u) => !u.profile).length,
      },
    };
  });

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({
      userId: z.string().max(80),
      role: z.enum(["admin", "user"]),
    })
  )
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    if (data.userId === context.user.id && data.role !== "admin") {
      throw new Error("Vous ne pouvez pas retirer votre propre rôle superadmin.");
    }
    await context
      .getApi()
      .asServiceRole.entities.User.update(data.userId, { role: data.role });
    return { ok: true };
  });

export const inviteAppUser = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({
      email: z.string().email().max(160),
      role: z.enum(["admin", "user"]),
    })
  )
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    await context.getApi().asServiceRole.users.inviteUser(data.email, data.role);
    return { ok: true };
  });

export const getSuperadminPayments = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    assertAdmin(context);
    const api = context.getApi();

    const [paymentsRes, subsRes, promosRes] = await Promise.all([
      api.entities.Payment.list({ limit: 300, sort: "-created_date" }),
      api.entities.Subscription.list({ limit: 300 }),
      api.entities.Promotion.list({ limit: 300 }),
    ]);

    const payments = asPage(paymentsRes).map((p) => {
      let target = null;
      if (p.type === "subscription") {
        const sub = asPage(subsRes).find((s) => s.id === p.reference_id);
        if (sub) target = { kind: "subscription", plan: sub.plan, status: sub.status };
      } else {
        const promo = asPage(promosRes).find((m) => m.id === p.reference_id);
        if (promo) {
          target = {
            kind: "boost",
            plan: promo.duration_label,
            status: promo.status,
            profile_id: promo.profile_id,
          };
        }
      }
      return { ...p, target };
    });

    const paid = payments.filter((p) => p.status === "paid");

    return {
      items: payments,
      totals: {
        revenue: paid.reduce((sum, p) => sum + (p.amount || 0), 0),
        pending: payments.filter((p) => p.status === "pending").length,
        paid: paid.length,
        subscriptions: payments.filter((p) => p.type === "subscription").length,
        boosts: payments.filter((p) => p.type === "boost").length,
      },
    };
  });

export const settlePayment = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({
      paymentId: z.string().max(80),
      outcome: z.enum(["paid", "failed"]),
    })
  )
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    const api = context.getApi().asServiceRole;
    const payment = await api.entities.Payment.get(data.paymentId);
    const now = new Date();

    if (data.outcome === "failed") {
      await api.entities.Payment.update(payment.id, { status: "failed" });

      if (payment.type === "subscription" && payment.reference_id) {
        await api.entities.Subscription.update(payment.reference_id, {
          status: "canceled",
        });
      }
      if (payment.type === "boost" && payment.reference_id) {
        await api.entities.Promotion.update(payment.reference_id, {
          status: "canceled",
        });
      }
      return { ok: true, status: "failed" };
    }

    await api.entities.Payment.update(payment.id, {
      status: "paid",
      paid_at: now.toISOString(),
    });

    if (payment.type === "subscription" && payment.reference_id) {
      const sub = await api.entities.Subscription.get(payment.reference_id);
      const ends = new Date(now.getTime() + 30 * 24 * 3600 * 1000);

      await api.entities.Subscription.update(sub.id, {
        status: "active",
        started_at: now.toISOString(),
        ends_at: ends.toISOString(),
      });

      if (sub.profile_id) {
        await api.entities.ArtistProfile.update(sub.profile_id, {
          plan: sub.plan,
          plan_status: "active",
          plan_ends_at: ends.toISOString(),
        });
      }
    }

    if (payment.type === "boost" && payment.reference_id) {
      const promo = await api.entities.Promotion.get(payment.reference_id);
      const ends = new Date(now.getTime() + (promo.duration_hours || 24) * 3600 * 1000);

      await api.entities.Promotion.update(promo.id, {
        status: "active",
        starts_at: now.toISOString(),
        ends_at: ends.toISOString(),
      });

      if (promo.profile_id) {
        await api.entities.ArtistProfile.update(promo.profile_id, {
          featured_until: ends.toISOString(),
        });
      }
    }

    return { ok: true, status: "paid" };
  });
// Entités qu'un export d'ancienne base peut réalimenter.
const IMPORTABLE = ["BlogPost", "Category", "PlanConfig", "ArtistProfile", "Artwork"];

export const importRecords = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({
      entity: z.enum(IMPORTABLE),
      records: z.array(z.record(z.string(), z.any())).min(1).max(100),
    }),
  )
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    return context.getApi().asServiceRole.entities[data.entity].importMany(data.records);
  });

// Diagnostic de la plateforme (admin) : services reliés et e-mail de test avec l'erreur exacte en cas d'échec.
export const getSystemStatus = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    assertAdmin(context);
    return systemStatus();
  });

export const sendTestEmailToMe = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    assertAdmin(context);
    return sendTestEmail(context.user.email);
  });

// Articles d'exemple du journal : chargement idempotent (relancer met à jour) et suppression en un clic.
export const loadExamplePosts = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    assertAdmin(context);
    return context.getApi().asServiceRole.entities.BlogPost.importMany(EXAMPLE_POSTS);
  });

export const removeExamplePosts = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    assertAdmin(context);
    const posts = context.getApi().asServiceRole.entities.BlogPost;
    let removed = 0;
    for (const post of EXAMPLE_POSTS) {
      try {
        await posts.delete(post.id);
        removed += 1;
      } catch {
        // déjà supprimé
      }
    }
    return { removed };
  });
