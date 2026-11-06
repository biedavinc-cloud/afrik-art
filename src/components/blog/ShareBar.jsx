import { useEffect, useState } from "react";
import { Check, Link2, Linkedin, MessageCircle, Twitter } from "lucide-react";

export default function ShareBar({ title }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => setUrl(window.location.href), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const links = [
    {
      key: "whatsapp",
      label: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`,
    },
    {
      key: "x",
      label: "X",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 border-y border-border py-4">
      <span className="mr-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        Partager
      </span>
      {links.map(({ key, label, icon: Icon, href }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`Partager sur ${label}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-foreground/30 hover:text-foreground"
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-[11.5px] font-medium transition-colors hover:border-foreground/30"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
        {copied ? "Lien copié" : "Copier le lien"}
      </button>
    </div>
  );
}