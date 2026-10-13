"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { submitEstimationAction } from "@/app/actions/public-leads";

export function EstimationForm() {
  const [state, formAction, pending] = useActionState(
    submitEstimationAction,
    undefined
  );

  if (state?.success) {
    return (
      <div className="h-fit rounded-sm border border-stone-line bg-white p-7">
        <h2 className="font-display text-xl text-ink">Demande envoyée</h2>
        <p className="mt-2 text-sm text-ink-60">
          Merci ! Un agent revient vers vous sous 24h ouvrées pour convenir
          d&apos;un rendez-vous.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="h-fit space-y-4 rounded-sm border border-stone-line bg-white p-7"
    >
      <h2 className="font-display text-xl text-ink">Votre bien</h2>

      <div className="grid grid-cols-2 gap-4">
        <Select name="category" defaultValue="" required>
          <option value="" disabled>
            Type de bien
          </option>
          <option value="appartement">Appartement</option>
          <option value="maison">Maison</option>
          <option value="terrain">Terrain</option>
          <option value="local_commercial">Local commercial</option>
        </Select>
        <Select name="purpose" defaultValue="" required>
          <option value="" disabled>
            Vous souhaitez
          </option>
          <option value="vendre">Vendre</option>
          <option value="louer">Louer</option>
        </Select>
      </div>

      <Input name="address" placeholder="Adresse du bien" required />

      <div className="grid grid-cols-2 gap-4">
        <Input name="surface" type="number" min={1} placeholder="Surface (m²)" required />
        <Input name="rooms" type="number" min={1} placeholder="Nombre de pièces" required />
      </div>

      <hr className="border-stone-line" />

      <h2 className="font-display text-xl text-ink">Vos coordonnées</h2>
      <Input name="name" placeholder="Nom complet" required />
      <div className="grid grid-cols-2 gap-4">
        <Input name="email" type="email" placeholder="Email" required />
        <Input name="phone" type="tel" placeholder="Téléphone" required />
      </div>

      {state?.error && (
        <p className="rounded-sm bg-alert/10 px-3 py-2 text-sm text-alert">
          {state.error}
        </p>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={pending}>
        {pending ? "Envoi..." : "Recevoir mon estimation"}
      </Button>
      <p className="text-center text-xs text-ink-60">
        Vos données ne servent qu&apos;à traiter votre demande. Voir nos{" "}
        <a href="/mentions-legales" className="underline">
          mentions légales
        </a>
        .
      </p>
    </form>
  );
}
