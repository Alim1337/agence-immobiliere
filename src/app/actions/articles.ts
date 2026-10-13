"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import * as articlesData from "@/lib/data/articles";

async function requireSession() {
  const session = await auth();
  if (!session) throw new Error("Non authentifié");
  return session.user;
}

export interface ArticleFormState {
  error?: string;
}

export async function createArticleAction(
  _prevState: ArticleFormState | undefined,
  formData: FormData
): Promise<ArticleFormState> {
  const user = await requireSession();

  const title = formData.get("title") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;

  if (!title || !excerpt || !content || !category) {
    return { error: "Merci de remplir tous les champs." };
  }

  const article = await articlesData.createArticle({
    title,
    excerpt,
    content,
    category,
    authorId: user.id,
  });

  revalidatePath("/admin/articles");
  redirect(`/admin/articles/${article.id}`);
}

export async function updateArticleAction(
  articleId: string,
  _prevState: ArticleFormState | undefined,
  formData: FormData
): Promise<ArticleFormState> {
  await requireSession();

  const title = formData.get("title") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;

  if (!title || !excerpt || !content || !category) {
    return { error: "Merci de remplir tous les champs." };
  }

  await articlesData.updateArticle(articleId, {
    title,
    excerpt,
    content,
    category,
  });

  revalidatePath("/admin/articles");
  revalidatePath(`/admin/articles/${articleId}`);
  revalidatePath("/actualites");
  return {};
}

export async function togglePublishArticleAction(articleId: string) {
  await requireSession();
  await articlesData.toggleArticlePublished(articleId);
  revalidatePath("/admin/articles");
  revalidatePath("/actualites");
}

export async function deleteArticleAction(articleId: string) {
  await requireSession();
  await articlesData.deleteArticle(articleId);
  revalidatePath("/admin/articles");
  revalidatePath("/actualites");
  redirect("/admin/articles");
}
