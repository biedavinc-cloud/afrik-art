import { redirect } from "@tanstack/react-router";
import { DefaultCatchBoundary } from "@/components/DefaultCatchBoundary";
import { authQuery } from "@/lib/AuthContext";

/**
 * Barrière de connexion d'une route sans chemin (src/routes/_authed.jsx), qui protège toutes les routes de
 * src/routes/_authed/ (leurs URL ne portent pas de segment « _authed ») :
 *
 *   createFileRoute("/_authed")({ ssr: false, beforeLoad: requireSignedIn, errorComponent: AuthGateError })
 *
 * Schéma « routes authentifiées » de TanStack Router : beforeLoad lit le visiteur dans le contexte du routeur
 * (le `authQuery` en cache, partagé avec useAuth()), donc le loader d'un enfant ne s'exécute jamais en anonyme.
 * Déconnecté → /login avec le chemin de retour. Les enfants lisent le visiteur via `Route.useRouteContext().user`.
 * `ssr: false` : le serveur est anonyme, ces pages ne s'affichent que dans le navigateur.
 */
export async function requireSignedIn({ context, location }) {
  // Une panne de /me (429, 503) n'est pas une déconnexion : elle est rejetée ici et atteint la page d'erreur,
  // dont « Réessayer » interroge de nouveau le serveur (une requête en échec ne met rien en cache).
  const { user } = await context.queryClient.ensureQueryData(authQuery);
  if (user) return { user };
  // Navigation complète volontaire : la page /login relit returnTo.
  throw redirect({ to: "/login", search: { returnTo: location.href }, reloadDocument: true });
}

export function AuthGateError({ error }) {
  return <DefaultCatchBoundary error={error} />;
}
