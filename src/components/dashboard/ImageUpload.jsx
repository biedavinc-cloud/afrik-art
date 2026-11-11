import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/api/client";
import { Image } from "@/components/ui/image";

export default function ImageUpload({ value, onChange, label, ratio = "aspect-[4/3]", hint }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  async function handle(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image trop lourde : 8 Mo maximum.");
      return;
    }
    setBusy(true);
    try {
      const res = await api.integrations.Core.UploadPublicFile({ file });
      onChange(res.file_url);
    } catch {
      toast.error("L'envoi a échoué. Réessayez.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      {label && <p className="mb-1.5 text-[12px] font-medium text-foreground/70">{label}</p>}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-secondary/40 transition-colors hover:border-accent ${ratio}`}
      >
        {value ? (
          <Image src={value} alt="Aperçu" className="h-full w-full" />
        ) : (
          <span className="flex flex-col items-center gap-2 text-[12px] text-muted-foreground">
            {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
            {busy ? "Envoi en cours…" : "Choisir une image"}
          </span>
        )}
      </button>
      <input ref={inputRef} type="file" accept="image/*" onChange={handle} className="hidden" />
      {hint && <p className="mt-1.5 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}