"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { submitPropertyContactAction } from "@/app/actions/public-leads";

export function ContactForm({
  propertyId,
  reference,
}: {
  propertyId: string;
  reference: string;
}) {
  const action = submitPropertyContactAction.bind(null, propertyId);
  const [state, formAction, pending] = useActionState(action, undefined);

  if (state?.success) {
    return (
      <div className="rounded-sm border border-stone-line bg-white p-6">
        <h3 className="font-display text-lg text-ink">Message envoyé</h3>
        <p className="mt-2 text-sm text-ink-60">
          Merci, un agent revient vers vous sous 24h ouvrées.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-3 rounded-sm border border-stone-line bg-white p-6"
    >
      <h3 className="font-display text-lg text-ink">Contacter un agent</h3>
      <p className="text-sm text-ink-60">
        Recevez une réponse sous 24h ouvrées.
      </p>
      <Input name="name" placeholder="Nom complet" required />
      <Input name="email" type="email" placeholder="Email" required />
      <Input name="phone" type="tel" placeholder="Téléphone" />
      <Input
        name="budgetMax"
        type="number"
        placeholder="Budget max envisagé (DA, optionnel)"
      />
      <textarea
        name="message"
        rows={3}
        placeholder="Votre message"
        defaultValue={`Bonjour, je suis intéressé(e) par le bien réf. ${reference}.`}
        className="w-full rounded-sm border border-stone-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:border-pine"
      />
      {state?.error && (
        <p className="rounded-sm bg-alert/10 px-3 py-2 text-sm text-alert">
          {state.error}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Envoi..." : "Envoyer ma demande"}
      </Button>
    </form>
  );
}
