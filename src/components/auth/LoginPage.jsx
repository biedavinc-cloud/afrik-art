import { LogIn, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import {
  AuthError,
  AuthLink,
  GoogleButton,
  OrDivider,
  PasswordField,
  SubmitButton,
} from "@/components/auth/parts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/api/client";
import { useAuth } from "@/lib/AuthContext";
import { safeReturnTo } from "@/lib/authReturnTo";

// The /login page. ?returnTo= (or the platform's ?from_url=) is where the visitor
// goes after signing in — the login gate and the MCP consent page send people here with it.
export function LoginPage() {
  const returnTo = safeReturnTo();
  // Sans destination demandée, on arrive dans son espace (qui propose de créer le profil s'il n'existe pas encore).
  const destination = returnTo === "/" ? "/dashboard" : returnTo;
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    if (isAuthenticated) window.location.replace(destination);
  }, [isAuthenticated, destination]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(() => {
    const code = typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("error");
    if (code === "google_failed") return "La connexion avec Google a échoué. Réessayez ou utilisez votre e-mail.";
    if (code === "google_unavailable") return "La connexion avec Google n'est pas disponible pour le moment.";
    return "";
  });
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api.auth.login(email, password);
      // Redirection complète : l'application repart avec la nouvelle session.
      window.location.href = destination;
    } catch (err) {
      setError(err.message || "Adresse e-mail ou mot de passe incorrect.");
      setBusy(false);
    }
  }

  return (
    <AuthLayout icon={LogIn} title="Bon retour." subtitle="Connectez-vous pour retrouver votre espace et vos messages.">
      <GoogleButton returnTo={returnTo} onError={setError} />
      <OrDivider />
      <AuthError>{error}</AuthError>
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login-email">Adresse e-mail</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input id="login-email" type="email" autoComplete="email" autoFocus placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 pl-10" required />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password">Mot de passe</Label>
            <AuthLink to="/forgot-password" returnTo={returnTo} className="text-xs text-primary hover:underline">
              Mot de passe oublié ?
            </AuthLink>
          </div>
          <PasswordField
            id="login-password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <SubmitButton busy={busy} busyLabel="Connexion…">
          Se connecter
        </SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Pas encore de compte ?{" "}
        <AuthLink to="/register" returnTo={returnTo}>
          Créer un compte
        </AuthLink>
      </p>
    </AuthLayout>
  );
}