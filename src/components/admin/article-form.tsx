"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { ArticleFormState } from "@/app/actions/articles";

const categories = ["Marché", "Réglementation", "Conseils", "Vie de l'agence"];

interface ArticleFormProps {
  action: (
    state: ArticleFormState | undefined,
    formData: FormData
  ) => Promise<ArticleFormState>;
  defaultValues?: {
    title: string;
    excerpt: string;
    content: string;
    category: string;
  };
  submitLabel: string;
}

export function ArticleForm({
  action,
  defaultValues,
  submitLabel,
}: ArticleFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form
      action={formAction}
      className="mt-6 space-y-4 rounded-sm border border-stone-line bg-white p-6"
    >
      <Input
        name="title"
        placeholder="Titre de l'article"
        defaultValue={defaultValues?.title}
        required
      />

      <Select
        name="category"
        defaultValue={defaultValues?.category ?? ""}
        required
      >
        <option value="" disabled>
          Catégorie
        </option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </Select>

      <textarea
        name="excerpt"
        rows={2}
        placeholder="Extrait (affiché dans la liste des articles)"
        defaultValue={defaultValues?.excerpt}
        required
        className="w-full rounded-sm border border-stone-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:border-pine"
      />

      <textarea
        name="content"
        rows={14}
        placeholder={
          "Contenu complet de l'article. Séparez les paragraphes par une ligne vide."
        }
        defaultValue={defaultValues?.content}
        required
        className="w-full rounded-sm border border-stone-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:border-pine"
      />

      {state?.error && (
        <p className="rounded-sm bg-alert/10 px-3 py-2 text-sm text-alert">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Enregistrement..." : submitLabel}
      </Button>
    </form>
  );
}
