"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "./favorites-context";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  propertyId,
  className,
}: {
  propertyId: string;
  className?: string;
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(propertyId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault(); // don't follow the parent <Link> when inside a card
        e.stopPropagation();
        toggleFavorite(propertyId);
      }}
      aria-label={active ? "Retirer des favoris" : "Ajouter aux favoris"}
      aria-pressed={active}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur transition-colors hover:bg-white",
        className
      )}
    >
      <Heart
        className={cn("h-4 w-4", active ? "fill-alert text-alert" : "text-ink-60")}
        strokeWidth={1.75}
      />
    </button>
  );
}
