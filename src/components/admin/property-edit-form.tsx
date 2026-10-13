"use client";

import { useActionState } from "react";
import type { Property } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { updatePropertyAction } from "@/app/actions/properties";

export function PropertyEditForm({ property }: { property: Property }) {
  const boundAction = updatePropertyAction.bind(null, property.id);
  const [state, formAction, pending] = useActionState(boundAction, undefined);

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-sm border border-stone-line bg-white p-6"
    >
      <Input
        name="title"
        placeholder="Titre de l'annonce"
        defaultValue={property.title}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Select name="kind" defaultValue={property.kind} required>
          <option value="VENTE">Vente</option>
          <option value="LOCATION">Location</option>
          <option value="NEUF">Programme neuf</option>
        </Select>
        <Select name="category" defaultValue={property.category} required>
          <option value="APPARTEMENT">Appartement</option>
          <option value="MAISON">Maison</option>
          <option value="TERRAIN">Terrain</option>
          <option value="LOCAL_COMMERCIAL">Local commercial</option>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input name="city" placeholder="Ville" defaultValue={property.city} required />
        <Input
          name="postalCode"
          placeholder="Code postal"
          defaultValue={property.postalCode}
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          name="price"
          type="number"
          placeholder="Prix (DA)"
          defaultValue={property.price}
          required
        />
        <Input
          name="surface"
          type="number"
          placeholder="Surface (m²)"
          defaultValue={property.surface}
          required
        />
        <Input
          name="rooms"
          type="number"
          placeholder="Pièces"
          defaultValue={property.rooms}
          required
        />
      </div>

      <textarea
        name="description"
        rows={5}
        placeholder="Description du bien"
        defaultValue={property.description}
        required
        className="w-full rounded-sm border border-stone-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:border-pine"
      />

      <div className="border-t border-stone-line pt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-60">
          Propriétaire (privé — jamais affiché publiquement, utilisé pour le mandat)
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Input
            name="ownerName"
            placeholder="Nom complet"
            defaultValue={property.ownerName ?? ""}
          />
          <Input
            name="ownerPhone"
            placeholder="Téléphone"
            defaultValue={property.ownerPhone ?? ""}
          />
          <Input
            name="ownerEmail"
            type="email"
            placeholder="Email"
            defaultValue={property.ownerEmail ?? ""}
          />
        </div>
      </div>

      <div className="border-t border-stone-line pt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-60">
          Position sur la carte (optionnel)
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Input
            name="latitude"
            type="number"
            step="any"
            placeholder="Latitude (ex: 36.7538)"
            defaultValue={property.latitude ?? ""}
          />
          <Input
            name="longitude"
            type="number"
            step="any"
            placeholder="Longitude (ex: 3.0588)"
            defaultValue={property.longitude ?? ""}
          />
        </div>
        <p className="mt-1.5 text-xs text-ink-60">
          Clic droit sur l&apos;emplacement dans Google Maps → copier les
          coordonnées → coller ici.
        </p>
      </div>

      {state?.error && (
        <p className="rounded-sm bg-alert/10 px-3 py-2 text-sm text-alert">
          {state.error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Enregistrement..." : "Enregistrer les modifications"}
      </Button>
    </form>
  );
}
