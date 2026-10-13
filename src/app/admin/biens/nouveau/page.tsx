"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/image-uploader";
import { createPropertyAction } from "@/app/actions/properties";

export default function NewPropertyPage() {
  const [state, formAction, pending] = useActionState(
    createPropertyAction,
    undefined
  );

  return (
    <div className="mx-auto max-w-2xl p-8">
      <Link
        href="/admin/biens"
        className="flex items-center gap-1.5 text-sm text-ink-60 hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Biens
      </Link>

      <h1 className="mt-4 font-display text-2xl text-ink">
        Ajouter un bien
      </h1>

      <form
        action={formAction}
        className="mt-6 space-y-4 rounded-sm border border-stone-line bg-white p-6"
      >
        <Input name="title" placeholder="Titre de l'annonce" required />

        <div className="grid grid-cols-2 gap-4">
          <Select name="kind" defaultValue="" required>
            <option value="" disabled>Transaction</option>
            <option value="VENTE">Vente</option>
            <option value="LOCATION">Location</option>
            <option value="NEUF">Programme neuf</option>
          </Select>
          <Select name="category" defaultValue="" required>
            <option value="" disabled>Type de bien</option>
            <option value="APPARTEMENT">Appartement</option>
            <option value="MAISON">Maison</option>
            <option value="TERRAIN">Terrain</option>
            <option value="LOCAL_COMMERCIAL">Local commercial</option>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input name="city" placeholder="Ville" required />
          <Input name="postalCode" placeholder="Code postal" required />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input name="price" type="number" placeholder="Prix (DA)" required />
          <Input name="surface" type="number" placeholder="Surface (m²)" required />
          <Input name="rooms" type="number" placeholder="Pièces" required />
        </div>

        <textarea
          name="description"
          rows={4}
          placeholder="Description du bien"
          required
          className="w-full rounded-sm border border-stone-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:border-pine"
        />

        <div>
          <label className="text-xs font-medium text-ink-60">Photos</label>
          <div className="mt-1.5">
            <ImageUploader name="images" />
          </div>
        </div>

        <div className="border-t border-stone-line pt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-60">
            Propriétaire (privé — jamais affiché publiquement, utilisé pour le mandat)
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <Input name="ownerName" placeholder="Nom complet" />
            <Input name="ownerPhone" placeholder="Téléphone" />
            <Input name="ownerEmail" type="email" placeholder="Email" />
          </div>
        </div>

        <div className="border-t border-stone-line pt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-60">
            Position sur la carte (optionnel)
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Input name="latitude" type="number" step="any" placeholder="Latitude (ex: 36.7538)" />
            <Input name="longitude" type="number" step="any" placeholder="Longitude (ex: 3.0588)" />
          </div>
          <p className="mt-1.5 text-xs text-ink-60">
            Clic droit sur l&apos;emplacement dans Google Maps → copier les
            coordonnées → coller ici.
          </p>
        </div>

        <div className="rounded-sm border border-dashed border-stone-line p-4 text-sm text-ink-60">
          Le bien est créé non publié (brouillon) — publie-le depuis la
          liste des biens une fois prêt.
        </div>

        {state?.error && (
          <p className="rounded-sm bg-alert/10 px-3 py-2 text-sm text-alert">
            {state.error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Enregistrement..." : "Enregistrer le bien"}
        </Button>
      </form>
    </div>
  );
}
