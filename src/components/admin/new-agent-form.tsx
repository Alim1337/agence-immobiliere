"use client";

import { useActionState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createUserAction } from "@/app/actions/users";

export function NewAgentForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    async (prevState: { error?: string } | undefined, formData: FormData) => {
      const result = await createUserAction(prevState, formData);
      if (!result.error) {
        formRef.current?.reset();
        router.refresh();
      }
      return result;
    },
    undefined
  );

  return (
    <form
      ref={formRef}
      action={formAction}
      className="grid gap-3 rounded-sm border border-stone-line bg-white p-5 sm:grid-cols-2"
    >
      <Input name="name" placeholder="Nom complet" required />
      <Input name="email" type="email" placeholder="Email" required />
      <Input name="phone" placeholder="Téléphone (optionnel)" />
      <Select name="role" defaultValue="AGENT" required>
        <option value="ADMIN">Directeur d&apos;agence</option>
        <option value="AGENT">Agent commercial</option>
        <option value="ASSISTANT">Assistant(e)</option>
      </Select>
      <Input
        name="password"
        type="password"
        placeholder="Mot de passe (min. 8 caractères)"
        required
        className="sm:col-span-2"
      />

      {state?.error && (
        <p className="rounded-sm bg-alert/10 px-3 py-2 text-sm text-alert sm:col-span-2">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="sm:col-span-2">
        {pending ? "Création..." : "Créer le compte"}
      </Button>
    </form>
  );
}
