"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteArticleAction } from "@/app/actions/articles";

export function DeleteArticleButton({ articleId }: { articleId: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!confirm("Supprimer définitivement cet article ?")) return;
    startTransition(async () => {
      await deleteArticleAction(articleId);
      router.push("/admin/articles");
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="flex items-center gap-1.5 text-sm text-alert hover:underline disabled:opacity-50"
    >
      <Trash2 className="h-3.5 w-3.5" />
      {pending ? "Suppression..." : "Supprimer"}
    </button>
  );
}
