import Link from "next/link";
import { getAllArticles } from "@/lib/data/articles";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArticlePublishToggle } from "@/components/admin/article-publish-toggle";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export default async function AdminArticlesPage() {
  const articles = await getAllArticles();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink">Articles</h1>
          <p className="mt-1 text-sm text-ink-60">
            {articles.length} article{articles.length > 1 ? "s" : ""}.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/articles/nouveau">Nouvel article</Link>
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-sm border border-stone-line bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-line text-left text-xs uppercase tracking-wide text-ink-60">
              <th className="px-4 py-3 font-medium">Titre</th>
              <th className="px-4 py-3 font-medium">Catégorie</th>
              <th className="px-4 py-3 font-medium">Auteur</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Publié</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="border-b border-stone-line last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/articles/${article.id}`}
                    className="font-medium text-ink hover:text-pine-dark"
                  >
                    {article.title}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline">{article.category}</Badge>
                </td>
                <td className="px-4 py-3 text-ink-60">{article.author.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink-60">
                  {formatDate(article.publishedAt)}
                </td>
                <td className="px-4 py-3">
                  <ArticlePublishToggle
                    articleId={article.id}
                    initialPublished={article.published}
                  />
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-60">
                  Aucun article pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
