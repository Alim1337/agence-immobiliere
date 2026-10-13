"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { togglePublishArticleAction } from "@/app/actions/articles";

export function ArticlePublishToggle({
  articleId,
  initialPublished,
}: {
  articleId: string;
  initialPublished: boolean;
}) {
  const [published, setPublished] = useState(initialPublished);
  const [, startTransition] = useTransition();

  function toggle() {
    setPublished((p) => !p);
    startTransition(async () => {
      await togglePublishArticleAction(articleId);
    });
  }

  return (
    <button
      onClick={toggle}
      className={cn(
        "relative h-6 w-11 rounded-full transition-colors",
        published ? "bg-pine" : "bg-stone-line"
      )}
      aria-label={published ? "Dépublier" : "Publier"}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
          published ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}
