import { prisma } from "@/lib/prisma";

export async function getPublishedArticles() {
  return prisma.article.findMany({
    where: { published: true },
    include: { author: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getArticleBySlug(slug: string) {
  return prisma.article.findFirst({
    where: { slug, published: true },
    include: { author: true },
  });
}

// --- Admin (all articles, regardless of publish status) ------------------

export async function getAllArticles() {
  return prisma.article.findMany({
    include: { author: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getArticleByIdAdmin(id: string) {
  return prisma.article.findUnique({
    where: { id },
    include: { author: true },
  });
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export interface CreateArticleInput {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  authorId: string;
}

export async function createArticle(input: CreateArticleInput) {
  const baseSlug = slugify(input.title);
  let slug = baseSlug;
  let i = 2;
  // Guarantee slug uniqueness even if two articles share a title
  while (await prisma.article.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${i}`;
    i++;
  }

  return prisma.article.create({
    data: {
      slug,
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      category: input.category,
      authorId: input.authorId,
      published: false,
    },
  });
}

export interface UpdateArticleInput {
  title: string;
  excerpt: string;
  content: string;
  category: string;
}

export async function updateArticle(id: string, input: UpdateArticleInput) {
  return prisma.article.update({
    where: { id },
    data: input,
  });
}

export async function toggleArticlePublished(articleId: string) {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
  });
  if (!article) throw new Error("Article introuvable");
  return prisma.article.update({
    where: { id: articleId },
    data: {
      published: !article.published,
      publishedAt: !article.published ? new Date() : article.publishedAt,
    },
  });
}

export async function deleteArticle(articleId: string) {
  return prisma.article.delete({ where: { id: articleId } });
}
