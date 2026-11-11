import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useMemo } from "react";
import { api } from "@/api/client";
import { currentUrl } from "@/lib/authReturnTo";

/**
 * Le visiteur, résolu une fois par chargement de page et mis en cache dans le QueryClient du routeur :
 * la barrière de connexion (src/components/auth/AuthGate.jsx) le lit avec
 * `context.queryClient.ensureQueryData(authQuery)`, les composants avec `useAuth()`.
 * Résout en `{ user, error }` : un visiteur anonyme (401/403) donne `{ user: null, error: null }`.
 * Toute autre erreur (panne, 429, 503, réseau) est rejetée : elle n'est jamais mise en cache comme
 * « déconnecté », la lecture suivante interroge de nouveau le serveur.
 */
export const authQuery = queryOptions({
  queryKey: ["auth", "me"],
  queryFn: async () => {
    try {
      return { user: await api.auth.me(), error: null };
    } catch (err) {
      if (err?.status === 401 || err?.status === 403) return { user: null, error: null };
      throw err;
    }
  },
  staleTime: Infinity,
  retry: false,
});

const AuthContext = createContext(null);

/**
 * État de session côté navigateur. Le serveur rend chaque page en anonyme et la requête ne s'exécute
 * qu'après l'hydratation : le premier rendu client correspond donc au HTML serveur.
 * Conditionnez l'interface propre à l'utilisateur sur `isLoadingAuth`.
 */
export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const { data, error, isPending } = useQuery(authQuery);

  const value = useMemo(
    () => ({
      user: data?.user ?? null,
      isAuthenticated: !!data?.user,
      isLoadingAuth: isPending,
      authError: data?.error ?? (error ? { type: "unknown", message: error.message ?? "Impossible de charger la session" } : null),
      refresh: () => queryClient.fetchQuery({ ...authQuery, staleTime: 0 }),
      logout: async () => {
        queryClient.setQueryData(authQuery.queryKey, { user: null, error: null });
        try {
          await api.auth.logout();
        } finally {
          window.location.assign("/");
        }
      },
      // Connexion en pleine page : /login avec la page actuelle comme retour.
      navigateToLogin: () => api.auth.redirectToLogin(currentUrl()),
    }),
    [data, error, isPending, queryClient],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
