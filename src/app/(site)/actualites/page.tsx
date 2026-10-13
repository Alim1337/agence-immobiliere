import Link from "next/link";
import { getPublishedArticles } from "@/lib/data/articles";
import { Badge } from "@/components/ui/badge";
import { PropertyPhoto } from "@/components/site/property-photo";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function ActualitesPage() {
  const articles = await getPublishedArticles();

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <span className="font-mono text-xs uppercase tracking-widest text-brass-dark">
        Actualités
      </span>
      <h1 className="mt-2 font-display text-3xl text-ink">
        Le marché immobilier algérois, décrypté
      </h1>
      <p className="mt-3 max-w-xl text-ink-60">
        Analyses de marché, réglementation, conseils pratiques : ce que nos
        agents partagent avec leurs clients, en accès libre.
      </p>

      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/actualites/${article.slug}`}
            className="group block overflow-hidden rounded-sm border border-stone-line bg-white transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(28,35,33,0.25)]"
          >
            <PropertyPhoto className="h-44 w-full" />
            <div className="p-5">
              <Badge variant="outline">{article.category}</Badge>
              <h2 className="mt-3 font-display text-lg leading-snug text-ink group-hover:text-pine-dark">
                {article.title}
              </h2>
              <p className="mt-2 text-sm text-ink-60">{article.excerpt}</p>
              <p className="mt-4 font-mono text-xs text-ink-60">
                {formatDate(article.publishedAt)} · {article.author.name}
              </p>
            </div>
          </Link>
        ))}

        {articles.length === 0 && (
          <p className="text-sm text-ink-60">
            Aucun article publié pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}
