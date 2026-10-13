"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Phone, Mail, StickyNote, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import type { InteractionType } from "@prisma/client";
import { interactionTypeLabels } from "@/lib/format";
import { addInteractionAction } from "@/app/actions/leads";

interface DisplayInteraction {
  id: string;
  type: InteractionType;
  content: string;
  authorName: string;
  createdAt: string | Date;
}

const typeIcons: Record<InteractionType, React.ReactNode> = {
  APPEL: <Phone className="h-3.5 w-3.5" />,
  EMAIL: <Mail className="h-3.5 w-3.5" />,
  NOTE: <StickyNote className="h-3.5 w-3.5" />,
  VISITE: <Home className="h-3.5 w-3.5" />,
};

export function InteractionTimeline({
  leadId,
  initial,
  authorName,
}: {
  leadId: string;
  initial: DisplayInteraction[];
  authorName: string;
}) {
  const [items, setItems] = useState(initial);
  const [type, setType] = useState<InteractionType>("NOTE");
  const [content, setContent] = useState("");
  const [, startTransition] = useTransition();
  const router = useRouter();

  function addInteraction(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    const value = content;
    setItems((prev) => [
      {
        id: `local-${Date.now()}`,
        type,
        content: value,
        authorName,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setContent("");
    startTransition(async () => {
      await addInteractionAction(leadId, type, value);
      router.refresh();
    });
  }

  return (
    <div>
      <form onSubmit={addInteraction} className="space-y-3">
        <div className="flex gap-2">
          <Select
            value={type}
            onChange={(e) => setType(e.target.value as InteractionType)}
            className="w-40"
          >
            <option value="NOTE">Note</option>
            <option value="APPEL">Appel</option>
            <option value="EMAIL">Email</option>
            <option value="VISITE">Visite</option>
          </Select>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Ajouter une interaction..."
            className="h-11 flex-1 rounded-sm border border-stone-line bg-white px-3.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:border-pine"
          />
          <Button type="submit">Ajouter</Button>
        </div>
      </form>

      <ol className="mt-6 space-y-4">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pine-tint text-pine-dark">
              {typeIcons[item.type]}
            </span>
            <div className="flex-1 border-b border-stone-line pb-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-ink">
                  {interactionTypeLabels[item.type]} — {item.authorName}
                </p>
                <p className="font-mono text-xs text-ink-60">
                  {new Intl.DateTimeFormat("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }).format(new Date(item.createdAt))}
                </p>
              </div>
              <p className="mt-1 text-sm text-ink-60">{item.content}</p>
            </div>
          </li>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-ink-60">Aucune interaction pour le moment.</p>
        )}
      </ol>
    </div>
  );
}
