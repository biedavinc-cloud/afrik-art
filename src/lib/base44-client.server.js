// Client Base44 côté serveur, pour une requête donnée.
//
// Sur la plateforme Base44, chaque requête arrive avec les en-têtes `Base44-App-Id`,
// `Base44-Api-Url`, etc. : `createClientFromRequest` s'en sert directement.
// Hébergée ailleurs (Cloudflare Workers), l'application ne reçoit aucun de ces en-têtes, et le SDK
// lève « Base44-App-Id header is required ». Dans ce cas on construit le client à partir de la
// configuration de l'application :
//   VITE_BASE44_APP_ID      (variable de build)   identifiant de l'app Base44 (24 caractères hexa)
//   VITE_BASE44_SERVER_URL  (variable de build)   par défaut https://base44.app
//   BASE44_SERVICE_TOKEN    (secret du Worker)    optionnel, requis seulement pour `asServiceRole`
import { env } from "cloudflare:workers";
import { createClient, createClientFromRequest } from "@base44/sdk";

const DEFAULT_SERVER_URL = "https://base44.app";

export function createBase44ClientForRequest(request) {
  // Hébergement Base44 : comportement inchangé.
  if (request.headers.get("Base44-App-Id")) return createClientFromRequest(request);

  const appId = import.meta.env.VITE_BASE44_APP_ID || env.BASE44_APP_ID;
  if (!appId) {
    throw new Error(
      "Configuration Base44 manquante : définissez VITE_BASE44_APP_ID (variable de build) avec l'identifiant de l'application.",
    );
  }

  const authorization = request.headers.get("Authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7).trim() : undefined;

  return createClient({
    appId,
    serverUrl: import.meta.env.VITE_BASE44_SERVER_URL || env.BASE44_API_URL || DEFAULT_SERVER_URL,
    token: token || undefined,
    serviceToken: env.BASE44_SERVICE_TOKEN || undefined,
  });
}
