import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";

const asItems = (res) => (Array.isArray(res) ? res : res?.items || []);
const nowIso = () => new Date().toISOString();

async function sendMail(api, { to, subject, html }) {
  if (!to) return false;
  try {
    await api.integrations.Core.SendEmail({ to, subject, html, category: "transactional" });
    return true;
  } catch {
    return false;
  }
}

function artistEmailTemplate(thread) {
  return `
    <div style="font-family:Helvetica,Arial,sans-serif;line-height:1.6;color:#1d1d1d">
      <h2 style="color:#e31d2b;margin-bottom:4px">Nouveau message client</h2>
      <p><strong>${thread.client_name}</strong> vous a contacté depuis Afrik Art.</p>
      <p style="margin:16px 0;padding:16px;background:#f7f7f7;border-radius:10px;white-space:pre-line">${thread.last_message}</p>
      <p>Répondez directement depuis votre espace : <a href="https://afrik.cloud/messagerie">ouvrir la messagerie</a></p>
      <p style="color:#666;font-size:12px">Email du client : ${thread.client_email}${
        thread.client_phone ? ` · Téléphone : ${thread.client_phone}` : ""
      }</p>
    </div>`;
}

function clientEmailTemplate(thread, artistName) {
  return `
    <div style="font-family:Helvetica,Arial,sans-serif;line-height:1.6;color:#1d1d1d">
      <h2 style="color:#e31d2b;margin-bottom:4px">Réponse de ${artistName}</h2>
      <p style="margin:16px 0;padding:16px;background:#f7f7f7;border-radius:10px;white-space:pre-line">${thread.last_message}</p>
      <p style="color:#666;font-size:12px">Afrik Art — la plateforme panafricaine des talents.</p>
    </div>`;
}

async function artistContact(api, artistUserId) {
  try {
    return await api.entities.User.get(artistUserId);
  } catch {
    return null;
  }
}

async function assertMember(api, threadId, userId) {
  const thread = await api.entities.MessageThread.get(threadId);
  if (thread.artist_user_id !== userId && thread.client_user_id !== userId) {
    throw new Error("Cette conversation ne vous appartient pas.");
  }
  return thread;
}

// Ouvre une conversation depuis la page publique d'un artiste.
export const startConversation = createServerFn({ method: "POST" })
  .validator(
    z.object({
      profileId: z.string().max(80),
      senderName: z.string().min(2).max(120),
      senderEmail: z.string().email().max(160),
      senderPhone: z.string().max(40).optional(),
      subject: z.string().max(160).optional(),
      message: z.string().min(10).max(4000),
      collaborationType: z
        .enum(["exposition", "achat", "commande", "presse", "collaboration", "autre"])
        .optional(),
      source: z.string().max(40).optional(),
    })
  )
  .handler(async ({ data, context }) => {
    const service = context.getApi().asServiceRole;
    const profile = await service.entities.ArtistProfile.get(data.profileId);
    if (!profile) throw new Error("Profil introuvable.");
    if (profile.accepting_contact === false) {
      throw new Error("Cet artiste ne reçoit pas de nouvelles demandes pour le moment.");
    }

    let clientUserId = "";
    try {
      const me = await context.getApi().auth.me();
      clientUserId = me?.id || "";
    } catch {
      clientUserId = "";
    }

    const subject = data.subject?.trim() || `Nouvelle demande — ${profile.display_name}`;
    const thread = await service.entities.MessageThread.create({
      profile_id: profile.id,
      artist_user_id: profile.user_id || "",
      artist_name: profile.display_name,
      client_user_id: clientUserId,
      client_name: data.senderName,
      client_email: data.senderEmail,
      client_phone: data.senderPhone || "",
      subject,
      collaboration_type: data.collaborationType || "collaboration",
      status: "open",
      last_message: data.message,
      last_message_at: nowIso(),
      artist_unread: 1,
      client_unread: 0,
      source: data.source || "profile",
    });

    await service.entities.Message.create({
      thread_id: thread.id,
      profile_id: profile.id,
      artist_user_id: profile.user_id || "",
      client_user_id: clientUserId,
      sender_user_id: clientUserId,
      sender_role: "client",
      sender_name: data.senderName,
      body: data.message,
      read_by_artist: false,
      read_by_client: true,
    });

    await service.entities.ContactRequest.create({
      profile_id: profile.id,
      artist_user_id: profile.user_id || "",
      artist_name: profile.display_name,
      sender_name: data.senderName,
      sender_email: data.senderEmail,
      subject,
      message: data.message,
      collaboration_type: data.collaborationType || "collaboration",
      status: "new",
    });

    let emailed = false;
    if (profile.notify_email !== false && profile.user_id) {
      const owner = await artistContact(service, profile.user_id);
      emailed = await sendMail(service, {
        to: owner?.email,
        subject: `${data.senderName} vous a contacté sur Afrik Art`,
        html: artistEmailTemplate({ ...thread, last_message: data.message }),
      });
    }

    return { ok: true, threadId: thread.id, emailed };
  });

export const listThreads = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    const api = context.getApi();
    const userId = context.user.id;
    const [asArtist, asClient] = await Promise.all([
      api.entities.MessageThread.filter({ artist_user_id: userId }, { limit: 200 }),
      api.entities.MessageThread.filter({ client_user_id: userId }, { limit: 200 }),
    ]);
    const seen = new Set();
    const threads = [...asItems(asArtist), ...asItems(asClient)]
      .filter((t) => (seen.has(t.id) ? false : seen.add(t.id)))
      .map((t) => ({ ...t, viewer_role: t.artist_user_id === userId ? "artist" : "client" }))
      .sort((a, b) => new Date(b.last_message_at || 0) - new Date(a.last_message_at || 0));
    return { threads, unread: threads.reduce((n, t) => n + (t.viewer_role === "artist" ? t.artist_unread || 0 : t.client_unread || 0), 0) };
  });

export const getUnreadCount = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    const api = context.getApi();
    const userId = context.user.id;
    const [asArtist, asClient] = await Promise.all([
      api.entities.MessageThread.filter({ artist_user_id: userId }, { limit: 200 }),
      api.entities.MessageThread.filter({ client_user_id: userId }, { limit: 200 }),
    ]);
    const unread =
      asItems(asArtist).reduce((n, t) => n + (t.artist_unread || 0), 0) +
      asItems(asClient).reduce((n, t) => n + (t.client_unread || 0), 0);
    return { unread };
  });

export const getThreadMessages = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ threadId: z.string().max(80) }))
  .handler(async ({ data, context }) => {
    const api = context.getApi();
    const thread = await assertMember(api, data.threadId, context.user.id);

    const res = await api.entities.Message.filter(
      { thread_id: thread.id },
      { sort: "created_date", limit: 200 }
    );
    const messages = asItems(res);

    const isArtist = thread.artist_user_id === context.user.id;
    await api.entities.MessageThread.update(thread.id, isArtist ? { artist_unread: 0 } : { client_unread: 0 });
    await api.entities.Message.updateMany(
      { thread_id: thread.id, read_by_artist: false },
      { $set: isArtist ? { read_by_artist: true } : { read_by_client: true } }
    );

    return {
      thread: { ...thread, viewer_role: isArtist ? "artist" : "client" },
      messages,
    };
  });

export const replyToThread = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ threadId: z.string().max(80), body: z.string().min(1).max(4000) }))
  .handler(async ({ data, context }) => {
    const api = context.getApi();
    const thread = await assertMember(api, data.threadId, context.user.id);
    const isArtist = thread.artist_user_id === context.user.id;

    const message = await api.entities.Message.create({
      thread_id: thread.id,
      profile_id: thread.profile_id,
      artist_user_id: thread.artist_user_id,
      client_user_id: thread.client_user_id,
      sender_user_id: context.user.id,
      sender_role: isArtist ? "artist" : "client",
      sender_name: isArtist ? thread.artist_name : context.user.full_name || thread.client_name,
      body: data.body,
      read_by_artist: isArtist,
      read_by_client: !isArtist,
    });

    await api.entities.MessageThread.update(thread.id, {
      last_message: data.body,
      last_message_at: nowIso(),
      status: "open",
      ...(isArtist
        ? { client_unread: (thread.client_unread || 0) + 1 }
        : { artist_unread: (thread.artist_unread || 0) + 1 }),
    });

    let emailed = false;
    if (isArtist) {
      if (thread.client_email) {
        emailed = await sendMail(api.asServiceRole, {
          to: thread.client_email,
          subject: `Réponse de ${thread.artist_name} sur Afrik Art`,
          html: clientEmailTemplate({ last_message: data.body }, thread.artist_name),
        });
      }
    } else {
      const owner = await artistContact(api.asServiceRole, thread.artist_user_id);
      emailed = await sendMail(api.asServiceRole, {
        to: owner?.email,
        subject: `${message.sender_name} vous a répondu sur Afrik Art`,
        html: artistEmailTemplate({ ...thread, last_message: data.body }),
      });
    }

    return { ok: true, message, emailed };
  });

export const setThreadStatus = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ threadId: z.string().max(80), status: z.enum(["open", "archived"]) }))
  .handler(async ({ data, context }) => {
    const api = context.getApi();
    await assertMember(api, data.threadId, context.user.id);
    await api.entities.MessageThread.update(data.threadId, { status: data.status });
    return { ok: true };
  });

export const setProfilePublished = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ profileId: z.string().max(80), published: z.boolean() }))
  .handler(async ({ data, context }) => {
    const api = context.getApi();
    const profile = await api.entities.ArtistProfile.get(data.profileId);
    if (profile.user_id !== context.user.id && context.user.role !== "admin") {
      throw new Error("Ce profil ne vous appartient pas.");
    }
    await api.entities.ArtistProfile.update(profile.id, { is_published: data.published });
    return { ok: true, published: data.published };
  });