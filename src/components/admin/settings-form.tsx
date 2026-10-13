"use client";

import { useActionState } from "react";
import type { AgencySettings } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogoUploader } from "@/components/admin/logo-uploader";
import { updateAgencySettingsAction } from "@/app/actions/settings";

export function SettingsForm({ settings }: { settings: AgencySettings }) {
  const [state, formAction, pending] = useActionState(
    updateAgencySettingsAction,
    undefined
  );

  return (
    <form
      action={formAction}
      className="mt-6 max-w-2xl space-y-5 rounded-sm border border-stone-line bg-white p-6"
    >
      <div>
        <label className="text-xs font-medium text-ink-60">Logo</label>
        <div className="mt-1.5">
          <LogoUploader name="logoUrl" initialUrl={settings.logoUrl} />
        </div>
      </div>

      <Input name="name" placeholder="Nom de l'agence" defaultValue={settings.name} required />
      <Input
        name="tagline"
        placeholder="Accroche (affichée en haut de l'accueil)"
        defaultValue={settings.tagline}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          name="addressLine"
          placeholder="Adresse"
          defaultValue={settings.addressLine}
          required
        />
        <Input name="city" placeholder="Ville" defaultValue={settings.city} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          name="postalCode"
          placeholder="Code postal"
          defaultValue={settings.postalCode}
        />
        <Input name="phone" placeholder="Téléphone" defaultValue={settings.phone} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            name="whatsapp"
            placeholder="Numéro WhatsApp"
            defaultValue={settings.whatsapp}
          />
          <p className="mt-1 text-xs text-ink-60">
            Format international sans le +, ex: 213555123456
          </p>
        </div>
        <Input
          name="email"
          type="email"
          placeholder="Email"
          defaultValue={settings.email}
          required
        />
      </div>

      {state?.error && (
        <p className="rounded-sm bg-alert/10 px-3 py-2 text-sm text-alert">
          {state.error}
        </p>
      )}
      {state && !state.error && (
        <p className="rounded-sm bg-pine-tint px-3 py-2 text-sm text-pine-dark">
          Paramètres enregistrés.
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
}
