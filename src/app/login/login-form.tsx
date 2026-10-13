"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginAction } from "@/app/actions/auth";

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-14">
      <span className="font-mono text-xs uppercase tracking-widest text-brass-dark">
        Espace agence
      </span>
      <h1 className="mt-2 font-display text-2xl text-ink">
        Connexion au back-office
      </h1>
      <p className="mt-2 text-sm text-ink-60">
        Réservé aux agents et à l&apos;administration de l&apos;agence.
      </p>

      <form action={formAction} className="mt-8 space-y-4">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div>
          <label className="text-xs font-medium text-ink-60">Email</label>
          <Input
            name="email"
            type="email"
            required
            defaultValue="claire.vasseur@maisonetfils.fr"
            className="mt-1.5"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-ink-60">
            Mot de passe
          </label>
          <Input
            name="password"
            type="password"
            required
            defaultValue="demo1234"
            className="mt-1.5"
          />
        </div>

        {state?.error && (
          <p className="rounded-sm bg-alert/10 px-3 py-2 text-sm text-alert">
            {state.error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Connexion..." : "Se connecter"}
        </Button>
      </form>

      <p className="mt-6 rounded-sm border border-dashed border-stone-line p-3 text-xs text-ink-60">
        Démo : n&apos;importe quel email ci-dessous avec le mot de passe{" "}
        <code className="font-mono">demo1234</code> —
        claire.vasseur@maisonetfils.fr (admin),
        nadir.belkacem@maisonetfils.fr (agent),
        emilie.roussel@maisonetfils.fr (agent).
      </p>
    </div>
  );
}
