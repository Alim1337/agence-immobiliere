import Link from "next/link";
import { BedDouble, Ruler } from "lucide-react";
import type { Property, PropertyImage as PropertyImageModel } from "@prisma/client";
import { formatPrice, kindLabels, statusLabels } from "@/lib/format";
import { PropertyImage } from "./property-image";
import { FavoriteButton } from "./favorite-button";
import { cn } from "@/lib/utils";

export function PropertyCard({
  property,
}: {
  property: Property & { images: PropertyImageModel[] };
}) {
  const isAvailable = property.status === "DISPONIBLE";

  return (
    <Link
      href={`/biens/${property.id}`}
      className="group block overflow-hidden rounded-sm border border-stone-line bg-white transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(28,35,33,0.25)]"
    >
      <div className="relative">
        <PropertyImage images={property.images} className="h-56 w-full" />
        <FavoriteButton propertyId={property.id} className="absolute right-3 top-3" />
        <div className="dossier-tab absolute left-0 top-4 rounded-r-sm px-3 py-1 text-xs">
          Réf. {property.reference}
        </div>
        {!isAvailable && (
          <div className="absolute right-4 top-4 rounded-sm bg-ink/85 px-2.5 py-1 text-[11px] uppercase tracking-wide text-stone">
            {statusLabels[property.status]}
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wide text-brass-dark">
            {kindLabels[property.kind]}
          </span>
          <span className="font-mono text-[13px] text-ink-60">
            {property.city}
          </span>
        </div>

        <h3 className="mt-2 font-display text-lg leading-snug text-ink group-hover:text-pine-dark">
          {property.title}
        </h3>

        <div className="mt-4 flex items-center gap-4 text-sm text-ink-60">
          <span className="flex items-center gap-1.5">
            <Ruler className="h-4 w-4" strokeWidth={1.5} />
            {property.surface} m²
          </span>
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <BedDouble className="h-4 w-4" strokeWidth={1.5} />
              {property.bedrooms} ch.
            </span>
          )}
        </div>

        <div className={cn("mt-4 border-t border-stone-line pt-4 font-mono text-lg text-ink")}>
          {formatPrice(property.price, property.kind)}
        </div>
      </div>
    </Link>
  );
}
