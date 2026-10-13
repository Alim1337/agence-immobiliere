"use client";

import { useEffect, useState } from "react";
import type { Property, PropertyImage as PropertyImageModel, User } from "@prisma/client";
import { useFavorites } from "@/components/site/favorites-context";
import { PropertyCard } from "@/components/site/property-card";
import { getFavoritePropertiesAction } from "@/app/actions/properties";

type PropertyWithRelations = Property & {
  images: PropertyImageModel[];
  agent: User;
};

export default function FavorisPage() {
  const { favorites } = useFavorites();
  const [properties, setProperties] = useState<PropertyWithRelations[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    getFavoritePropertiesAction(favorites).then((res) => {
      if (!cancelled) setProperties(res);
    });
    return () => {
      cancelled = true;
    };
  }, [favorites]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <span className="font-mono text-xs uppercase tracking-widest text-brass-dark">
        Vos favoris
      </span>
      <h1 className="mt-2 font-display text-3xl text-ink">
        Biens sauvegardés
      </h1>
      <p className="mt-3 max-w-xl text-ink-60">
        Cliquez sur le cœur d&apos;une annonce pour la retrouver ici. Ces
        favoris sont enregistrés dans ce navigateur uniquement.
      </p>

      {properties === null ? (
        <p className="mt-10 text-sm text-ink-60">Chargement...</p>
      ) : properties.length === 0 ? (
        <div className="mt-10 rounded-sm border border-dashed border-stone-line p-12 text-center">
          <p className="font-display text-lg text-ink">
            Aucun favori pour le moment
          </p>
          <p className="mt-2 text-sm text-ink-60">
            Parcourez nos biens et cliquez sur le cœur pour les sauvegarder
            ici.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
