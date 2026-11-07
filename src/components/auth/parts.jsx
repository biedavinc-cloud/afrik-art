import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { GoogleIcon } from "./GoogleIcon";
import { signInWithProvider } from "@/lib/authMfaFlow";
import { returnToSearch } from "@/lib/authReturnTo";

// Small pieces the auth pages share.

export function AuthError({ children }) {
  if (!children) return null;
  return (
    <div role="alert" className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
      {children}
    </div>
  );
}

export function SubmitButton({ busy, busyLabel, children, ...props }) {
  return (
    <Button type="submit" className="h-12 w-full font-medium" disabled={busy} {...props}>
      {busy ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          {busyLabel}
        </>
      ) : (
        children
      )}
    </Button>
  );
}

// Champ mot de passe avec l'œil pour afficher/masquer la saisie.
export function PasswordField({
  id,
  value,
  onChange,
  placeholder = "••••••••",
  autoComplete = "current-password",
  disabled,
  autoFocus,
  required,
  className,
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Lock
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        id={id}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoFocus={autoFocus}
        required={required}
        className={cn("h-12 pl-10 pr-11", className)}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        aria-pressed={visible}
        tabIndex={-1}
        className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

// Indicateur de robustesse du mot de passe (3 segments).
export function PasswordStrength({ value = "" }) {
  const score =
    (value.length >= 8 ? 1 : 0) +
    (/[A-Z]/.test(value) && /[a-z]/.test(value) ? 1 : 0) +
    (/[0-9]/.test(value) && /[^A-Za-z0-9]/.test(value) ? 1 : 0);
  const labels = ["Trop court", "Correct", "Solide", "Excellent"];
  const tones = ["bg-destructive", "bg-amber-500", "bg-teal-600", "bg-primary"];
  return (
    <div className="pt-1">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              value && i < score ? tones[score] : "bg-border"
            )}
          />
        ))}
      </div>
      <p className="mt-1.5 text-[11px] text-muted-foreground">
        {value ? labels[score] : "8 caractères minimum, une majuscule et un chiffre."}
      </p>
    </div>
  );
}

export function GoogleButton({ returnTo, onError }) {
  return (
    <Button
      type="button"
      variant="outline"
      className="mb-6 h-12 w-full text-sm font-medium"
      onClick={() => signInWithProvider("google", returnTo).catch((err) => onError(err.message || "Connexion Google impossible"))}
    >
      <GoogleIcon className="mr-2 h-5 w-5" />
      Continuer avec Google
    </Button>
  );
}

export function OrDivider() {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-3 text-muted-foreground">ou</span>
      </div>
    </div>
  );
}

// A link between auth screens that carries the way back (?returnTo=) along.
export function AuthLink({ to, returnTo, className = "font-medium text-primary hover:underline", children }) {
  return (
    <Link to={to} search={returnToSearch(returnTo)} className={className}>
      {children}
    </Link>
  );
}