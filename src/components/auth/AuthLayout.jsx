import { Link } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import ArtisticBackdrop from "@/components/art/ArtisticBackdrop";

// Écran d'authentification en deux volets : un panneau éditorial illustré
// (identité Afrik Art) et le formulaire, sur fond sobre.
export function AuthLayout({ title, subtitle, footer, children }) {
  return (
    <div className="grid min-h-screen bg-background text-foreground lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-foreground lg:block">
        <Image
          src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1400&q=85"
          alt="Détail d'une œuvre peinte aux tons chauds"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/60 to-black/85" />
        <ArtisticBackdrop variant="dark" />

        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          <Link to="/" className="group flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-[13px] font-semibold tracking-tight text-primary-foreground">
              AA
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-[15px] font-semibold text-white">Afrik Art</span>
              <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.26em] text-white/50">
                Talents d'Afrique
              </span>
            </span>
          </Link>

          <div className="max-w-md">
            <span className="rule-gold block" />
            <p className="mt-7 font-heading text-[clamp(1.7rem,2.6vw,2.4rem)] font-semibold leading-[1.15] text-white">
              Votre travail mérite{" "}
              <span className="italic text-accent">d'être vu.</span>
            </p>
            <p className="mt-5 text-[13.5px] leading-relaxed text-white/60">
              Portfolios soignés, visibilité internationale, messages de clients réunis au même
              endroit. Rejoignez la plateforme panafricaine des créateurs.
            </p>
            <div className="mt-9 flex items-center gap-6 border-t border-white/15 pt-6 text-white/60">
              <div>
                <p className="text-[17px] font-semibold text-white">15</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em]">Pays</p>
              </div>
              <span className="h-8 w-px bg-white/15" />
              <div>
                <p className="text-[17px] font-semibold text-white">54</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em]">Disciplines</p>
              </div>
              <span className="h-8 w-px bg-white/15" />
              <div>
                <p className="text-[17px] font-semibold text-white">0 $</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em]">Pour commencer</p>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-white/35">
            Développé par Liaffrik Tech Dubai — Yaoundé
          </p>
        </div>
      </aside>

      <main className="relative flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-10 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-[12px] font-semibold text-primary-foreground">
              AA
            </span>
            <span className="text-[14px] font-semibold">Afrik Art</span>
          </Link>

          <h1 className="font-heading text-[clamp(1.6rem,3vw,2.1rem)] font-semibold leading-tight tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{subtitle}</p>
          )}

          <div className="mt-8">{children}</div>
          {footer && <div className="mt-7 text-center text-[12.5px] text-muted-foreground">{footer}</div>}
        </div>
      </main>
    </div>
  );
}