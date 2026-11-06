import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FaqList({ items, className }) {
  const [open, setOpen] = useState(0);
  return (
    <div className={cn("divide-y divide-border rounded-2xl border border-border bg-card", className)}>
      {items.map((item, index) => {
        const active = open === index;
        return (
          <div key={item.q}>
            <button
              onClick={() => setOpen(active ? -1 : index)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
            >
              <span className="text-[14px] font-medium">{item.q}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                  active && "rotate-180"
                )}
              />
            </button>
            {active && (
              <p className="whitespace-pre-line px-5 pb-5 text-[13.5px] leading-relaxed text-muted-foreground sm:px-6">
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}