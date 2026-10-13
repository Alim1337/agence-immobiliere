import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getArticleByIdAdmin } from "@/lib/data/articles";
import { ArticleForm } from "@/components/admin/article-form";
import { ArticlePublishToggle } from "@/components/admin/article-publish-toggle";
import { DeleteArticleButton } from "@/components/admin/delete-article-button";
import { updateArticleAction } from "@/app/actions/articles";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleByIdAdmin(id);
  if (!article) notFound();

  const boundUpdateAction = updateArticleAction.bind(null, article.id);

  return (
    <div className="mx-auto max-w-2xl p-8">
      <Link
        href="/admin/articles"
        className="flex items-center gap-1.5 text-sm text-ink-60 hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Articles
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink">
            Modifier l&apos;article
          </h1>
          <p className="mt-1 text-sm text-ink-60">
            Par {article.author.name}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-60">Publié</span>
            <ArticlePublishToggle
              articleId={article.id}
              initialPublished={article.published}
            />
          </div>
          <DeleteArticleButton articleId={article.id} />
        </div>
      </div>

      <ArticleForm
        action={boundUpdateAction}
        defaultValues={{
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          category: article.category,
        }}
        submitLabel="Enregistrer les modifications"
      />
    </div>
  );
}
