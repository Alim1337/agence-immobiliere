"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { Property, User } from "@prisma/client";
import { formatPrice, kindLabels, statusLabels } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { togglePublishAction } from "@/app/actions/properties";

type PropertyWithAgent = Property & { agent: User };

export function PropertiesTable({ initial }: { initial: PropertyWithAgent[] }) {
  const [items, setItems] = useState(initial);
  const [, startTransition] = useTransition();

  function togglePublished(id: string) {
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, published: !p.published } : p))
    );
    startTransition(async () => {
      await togglePublishAction(id);
    });
  }

  return (
    <div className="overflow-x-auto rounded-sm border border-stone-line bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-line text-left text-xs uppercase tracking-wide text-ink-60">
            <th className="px-4 py-3 font-medium">Réf.</th>
            <th className="px-4 py-3 font-medium">Bien</th>
            <th className="px-4 py-3 font-medium">Ville</th>
            <th className="px-4 py-3 font-medium">Prix</th>
            <th className="px-4 py-3 font-medium">Statut</th>
            <th className="px-4 py-3 font-medium">Agent</th>
            <th className="px-4 py-3 font-medium">Publié</th>
            <th className="px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id} className="border-b border-stone-line last:border-0">
              <td className="px-4 py-3 font-mono text-xs text-ink-60">
                {p.reference}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/biens/${p.id}`}
                  className="font-medium text-ink hover:text-pine-dark"
                >
                  {p.title}
                </Link>
                <p className="text-xs text-ink-60">{kindLabels[p.kind]}</p>
              </td>
              <td className="px-4 py-3 text-ink-60">{p.city}</td>
              <td className="px-4 py-3 font-mono text-ink">
                {formatPrice(p.price, p.kind)}
              </td>
              <td className="px-4 py-3">
                <Badge variant={p.status === "DISPONIBLE" ? "pine" : "outline"}>
                  {statusLabels[p.status]}
                </Badge>
              </td>
              <td className="px-4 py-3 text-ink-60">{p.agent.name}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => togglePublished(p.id)}
                  className={cn(
                    "relative h-6 w-11 rounded-full transition-colors",
                    p.published ? "bg-pine" : "bg-stone-line"
                  )}
                  aria-label={
                    p.published
                      ? "Dépublier du site public"
                      : "Publier sur le site public"
                  }
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                      p.published ? "translate-x-5" : "translate-x-0.5"
                    )}
                  />
                </button>
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/admin/biens/${p.id}`}
                  className="text-sm text-pine hover:text-pine-dark"
                >
                  Modifier
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
