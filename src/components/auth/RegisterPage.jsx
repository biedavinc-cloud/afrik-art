import { Mail, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/api/client";
import { useAuth } from "@/lib/AuthContext";
import { AuthLayout } from "@/components/auth/AuthLayout";
import {
  AuthError,
  AuthLink,
  GoogleButton,
  OrDivider,
  PasswordField,
  PasswordStrength,
  SubmitButton,
} from "@/components/auth/parts";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { safeReturnTo } from "@/lib/authReturnTo";

const isAlreadyVerified = (err) => err?.status === 400 && /already verified/i.test(err?.message ?? "");

/**
 * The /register page: register → OTP → verifyOtp → setToken. Registration alone
 * does not sign the user in (the account is unverified), so the code step is never
 * skipped and loginViaEmailPassword is never called right after register.
 */
export function RegisterPage() {
  const returnTo = safeReturnTo();
  // Sans destination demandée, on arrive dans son espace (qui propose de créer le profil s'il n'existe pas encore).
  const destination = returnTo === "/" ? "/dashboard" : returnTo;
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    if (isAuthenticated) window.location.replace(destination);
  }, [isAuthenticated, destination]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState("form");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  // Renvoi du code : 60 s entre deux demandes (évite les envois en rafale).
  const [cooldown, setCooldown] = useState(0);
  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function register(e) {
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
      const result = await api.auth.register({ email, password });
      setStep("otp");
      setCooldown(60);
      if (result?.emailed === false) setError("L'e-mail contenant le code n'a pas pu être envoyé pour le moment. Réessayez avec « Renvoyer le code » dans un instant ; si le problème persiste, contactez le support.");
    } catch (err) {
      setError(err.message || "La création du compte a échoué.");
    } finally {
      setBusy(false);
    }
  }

  async function verify(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api.auth.verifyOtp({ email, otpCode });
      // Le serveur a ouvert la session (cookie) : rechargement complet pour repartir connecté.
      window.location.href = destination;
    } catch (err) {
      // Verified server-side but the answer never arrived: the code is spent and
      // there is no token, so the only way forward is a normal sign-in.
      if (isAlreadyVerified(err)) setStep("already_verified");
      else setError(err.message || "Code de vérification invalide.");
      setBusy(false);
    }
  }

  async function resend() {
    setError("");
    if (cooldown > 0) return;
    try {
      const result = await api.auth.resendOtp(email);
      setCooldown(60);
      if (result?.emailed === false) setError("L'e-mail contenant le code n'a pas pu être envoyé pour le moment. Réessayez avec « Renvoyer le code » dans un instant ; si le problème persiste, contactez le support.");
      else toast("Code envoyé", { description: "Consultez votre boîte mail (et vos courriers indésirables) pour le nouveau code." });
    } catch (err) {
      if (isAlreadyVerified(err)) setStep("already_verified");
      else setError(err.message || "Impossible de renvoyer le code.");
    }
  }

  // The account is verified; the second sign-in step replaces the whole page and finishes signing in.

  if (step === "already_verified") {
    return (
      <AuthLayout icon={UserPlus} title="Créer votre compte" subtitle="Ouvrez votre profil public en quelques minutes.">
        <p className="mb-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{email}</span> est déjà vérifié. Connectez-vous
          pour continuer.
        </p>
        <AuthLink to="/login" returnTo={returnTo} className="inline-flex h-12 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Se connecter
        </AuthLink>
      </AuthLayout>
    );
  }

  if (step === "otp") {
    return (
      <AuthLayout icon={UserPlus} title="Créer votre compte" subtitle="Ouvrez votre profil public en quelques minutes.">
        <form onSubmit={verify}>
          <p className="mb-4 text-sm text-muted-foreground">
            Nous avons envoyé un code à 6 chiffres à{" "}
            <span className="font-medium text-foreground">{email}</span>. Pensez à vérifier vos courriers
            indésirables.
          </p>
          <AuthError>{error}</AuthError>
          <div className="mb-6 flex justify-center">
            <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode} autoFocus autoComplete="one-time-code">
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <SubmitButton busy={busy} busyLabel="Vérification…" disabled={busy || otpCode.length < 6}>
            Vérifier mon adresse
          </SubmitButton>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Code non reçu ?{" "}
            <button
              type="button"
              onClick={resend}
              disabled={cooldown > 0}
              className="font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
            >
              {cooldown > 0 ? `Renvoyer le code (${cooldown} s)` : "Renvoyer le code"}
            </button>
          </p>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Mauvaise adresse ?{" "}
            <button
              type="button"
              onClick={() => {
                setStep("form");
                setOtpCode("");
                setError("");
              }}
              className="font-medium text-primary hover:underline"
            >
              La modifier
            </button>
          </p>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Créer votre compte"
      subtitle="Ouvrez votre profil public en quelques minutes."
    >
      <GoogleButton returnTo={returnTo} onError={setError} />
      <OrDivider />
      <AuthError>{error}</AuthError>
      <form onSubmit={register} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="register-email">Adresse e-mail</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input id="register-email" type="email" autoComplete="email" autoFocus placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 pl-10" disabled={busy} required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-password">Mot de passe</Label>
          <PasswordField
            id="register-password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={busy}
            required
          />
          <PasswordStrength value={password} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-confirm">Confirmer le mot de passe</Label>
          <PasswordField
            id="register-confirm"
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={busy}
            required
          />
        </div>
        <SubmitButton busy={busy} busyLabel="Création du compte…">
          Créer mon compte
        </SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Vous avez déjà un compte ?{" "}
        <AuthLink to="/login" returnTo={returnTo}>
          Se connecter
        </AuthLink>
      </p>
    </AuthLayout>
  );
}