import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function PropertyPhoto({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-stone-100 text-ink-60",
        "bg-[linear-gradient(135deg,rgba(47,74,62,0.08),rgba(176,138,78,0.08))]",
        className
      )}
    >
      <ImageIcon className="h-6 w-6 opacity-40" strokeWidth={1.25} />
    </div>
  );
}
