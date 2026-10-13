import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ArticleForm } from "@/components/admin/article-form";
import { createArticleAction } from "@/app/actions/articles";

export default function NewArticlePage() {
  return (
    <div className="mx-auto max-w-2xl p-8">
      <Link
        href="/admin/articles"
        className="flex items-center gap-1.5 text-sm text-ink-60 hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Articles
      </Link>

      <h1 className="mt-4 font-display text-2xl text-ink">Nouvel article</h1>
      <p className="mt-1 text-sm text-ink-60">
        Créé non publié — publie-le depuis la liste une fois relu.
      </p>

      <ArticleForm action={createArticleAction} submitLabel="Créer l'article" />
    </div>
  );
}
