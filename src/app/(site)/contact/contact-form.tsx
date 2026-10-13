"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { submitGeneralContactAction } from "@/app/actions/public-leads";

export function GeneralContactForm() {
  const [state, formAction, pending] = useActionState(
    submitGeneralContactAction,
    undefined
  );

  if (state?.success) {
    return (
      <div className="h-fit rounded-sm border border-stone-line bg-white p-7">
        <h2 className="font-display text-xl text-ink">Message envoyé</h2>
        <p className="mt-2 text-sm text-ink-60">
          Merci, un membre de l&apos;équipe revient vers vous sous 24h
          ouvrées.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="h-fit space-y-4 rounded-sm border border-stone-line bg-white p-7"
    >
      <h2 className="font-display text-xl text-ink">Nous écrire</h2>

      <Input name="name" placeholder="Nom complet" required />
      <div className="grid grid-cols-2 gap-4">
        <Input name="email" type="email" placeholder="Email" required />
        <Input name="phone" type="tel" placeholder="Téléphone" />
      </div>
      <textarea
        name="message"
        rows={5}
        placeholder="Votre message"
        required
        className="w-full rounded-sm border border-stone-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:border-pine"
      />

      {state?.error && (
        <p className="rounded-sm bg-alert/10 px-3 py-2 text-sm text-alert">
          {state.error}
        </p>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={pending}>
        {pending ? "Envoi..." : "Envoyer le message"}
      </Button>
    </form>
  );
}
