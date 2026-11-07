import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { ChevronDown, LogOut, Menu, Settings, UserRound, X, Search } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useI18n } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, navigateToLogin, logout } = useAuth();
  const { t } = useI18n();
  const location = useLocation();

  const nav = [
    { label: t("nav.home"), to: "/" },
    { label: t("nav.explore"), to: "/explorer" },
    { label: t("nav.gallery"), to: "/galerie" },
    { label: t("nav.journal"), to: "/actualites" },
    { label: t("nav.pricing"), to: "/tarifs" },
  ];

  const secondary = [
    { label: t("nav.search"), to: "/recherche" },
    { label: t("nav.top"), to: "/top-artistes" },
    { label: t("nav.categories"), to: "/categories" },
    { label: t("nav.guide"), to: "/guide-artiste" },
    { label: t("nav.faq"), to: "/faq" },
    { label: t("nav.support"), to: "/support" },
    { label: t("nav.contact"), to: "/contact-artiste" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5 lg:h-20 lg:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-[13px] font-semibold tracking-tight text-primary-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
            AA
          </span>
          <span className="hidden flex-col leading-none sm:flex">
            <span className="text-[15px] font-semibold tracking-tight">{t("brand.name")}</span>
            <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
              {t("brand.tagline")}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map((item) => {
            const active =
              item.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "relative text-[13.5px] font-medium text-foreground/70 transition-colors hover:text-foreground",
                  active ? "text-foreground" : "nav-underline"
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute -bottom-2 left-0 h-[2px] w-full bg-accent" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/explorer"
            aria-label={t("header.search")}
            className="hidden h-10 w-10 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground sm:flex"
          >
            <Search className="h-[18px] w-[18px]" strokeWidth={1.6} />
          </Link>

          <div className="hidden lg:block">
            <LanguageSwitcher />
          </div>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="hidden items-center gap-2 rounded-full border border-border px-3 py-2 text-[13px] font-medium transition-colors hover:border-accent/60 hover:bg-secondary sm:flex">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-[10px] font-semibold uppercase text-background">
                  {(user?.full_name || user?.email || "A").charAt(0)}
                </span>
                {user?.full_name ? user.full_name.split(" ")[0] : t("header.space")}
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate text-[11px] font-normal text-muted-foreground">
                  {user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer">
                    <UserRound className="mr-2 h-4 w-4" /> Mon espace
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/parametres" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" /> Paramètres
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" /> Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <button
                onClick={() => navigateToLogin()}
                className="hidden text-[13px] font-medium text-foreground/70 transition-colors hover:text-foreground sm:block"
              >
                {t("header.login")}
              </button>
              <Link
                to="/register"
                className="hidden rounded-full bg-foreground px-5 py-2.5 text-[13px] font-medium text-background transition-colors hover:bg-primary sm:block"
              >
                {t("header.signup")}
              </Link>
            </>
          )}

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-5 pb-6 pt-4 lg:hidden">
          <nav className="flex flex-col">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="border-b border-border/70 py-3.5 text-[15px] font-medium"
              >
                {item.label}
              </Link>
            ))}
            {secondary.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="border-b border-border/70 py-3 text-[13.5px] text-foreground/70"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-5">
            <LanguageSwitcher />
          </div>

          <div className="mt-4 flex flex-col gap-2.5">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-foreground px-5 py-3 text-center text-[14px] font-medium text-background"
                >
                  {t("header.space")}
                </Link>
                <Link
                  to="/parametres"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-border px-5 py-3 text-center text-[14px] font-medium"
                >
                  Paramètres
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="rounded-full border border-border px-5 py-3 text-center text-[14px] font-medium text-destructive"
                >
                  Se déconnecter
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-foreground px-5 py-3 text-center text-[14px] font-medium text-background"
                >
                  {t("header.signup")}
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    navigateToLogin();
                  }}
                  className="rounded-full border border-border px-5 py-3 text-[14px] font-medium"
                >
                  {t("header.login")}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}