import { Link } from "@tanstack/react-router";
import { AlertTriangle, Lock } from "lucide-react";
import { useState } from "react";
import { api } from "@/api/client";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthError, PasswordField, PasswordStrength, SubmitButton } from "@/components/auth/parts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// The /reset-password page; the reset email links here with ?token=.
export function ResetPasswordPage() {
  // Read raw: the router's search parser would turn an all-digit token into a number.
  const token = new URLSearchParams(window.location.search).get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (password.length < 8) {
      setError("Choisissez un mot de passe d'au moins 8 caractères.");
      return;
    }
    setBusy(true);
    try {
      await api.auth.resetPassword({ resetToken: token, newPassword: password });
      window.location.href = "/login";
    } catch (err) {
      setError(err.message || "La réinitialisation a échoué.");
      setBusy(false);
    }
  }

  if (!token) {
    return (
      <AuthLayout
        icon={AlertTriangle}
        title="Invalid reset link"
        subtitle="This password reset link is missing or invalid"
        footer={
          <Link to="/forgot-password" className="font-medium text-primary hover:underline">
            Request a new link
          </Link>
        }
      >
        <p className="text-center text-sm text-foreground">The link you used appears to be incomplete. Please request a new password reset email.</p>
      </AuthLayout>
    );
  }
  return (
    <AuthLayout
      icon={Lock}
      title="Nouveau mot de passe"
      subtitle="Choisissez un mot de passe solide et unique."
    >
      <AuthError>{error}</AuthError>
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reset-password">Nouveau mot de passe</Label>
          <PasswordField
            id="reset-password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
          />
          <PasswordStrength value={password} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reset-confirm">Confirmer le mot de passe</Label>
          <PasswordField
            id="reset-confirm"
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>
        <SubmitButton busy={busy} busyLabel="Réinitialisation…">
          Réinitialiser le mot de passe
        </SubmitButton>
      </form>
    </AuthLayout>
  );
}