import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getArticleBySlug } from "@/lib/data/articles";
import { PropertyPhoto } from "@/components/site/property-photo";
import { Badge } from "@/components/ui/badge";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const paragraphs = article.content.split("\n\n");

  return (
    <article className="mx-auto max-w-2xl px-6 py-14">
      <Link
        href="/actualites"
        className="flex items-center gap-1.5 text-sm text-ink-60 hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Toutes les actualités
      </Link>

      <Badge variant="outline" className="mt-6">
        {article.category}
      </Badge>
      <h1 className="mt-3 font-display text-3xl leading-tight text-ink">
        {article.title}
      </h1>
      <p className="mt-3 font-mono text-xs text-ink-60">
        {formatDate(article.publishedAt)} · Par {article.author.name}
      </p>

      <PropertyPhoto className="mt-8 h-72 w-full rounded-sm" />

      <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-ink">
        {paragraphs.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-12 flex items-center gap-3 border-t border-stone-line pt-6">
        <PropertyPhoto className="h-12 w-12 rounded-full shrink-0" />
        <div>
          <p className="text-sm font-medium text-ink">{article.author.name}</p>
        </div>
      </div>
    </article>
  );
}
