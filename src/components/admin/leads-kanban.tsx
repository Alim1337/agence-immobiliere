"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Lead, Property, User, PipelineStage } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { stageLabels, stageOrder, sourceLabels } from "@/lib/format";
import { assignLeadAction, moveLeadStageAction } from "@/app/actions/leads";

type LeadWithRelations = Lead & {
  assignedTo: User | null;
  property: Property | null;
};

interface Agent {
  id: string;
  name: string;
}

export function LeadsKanban({
  initialLeads,
  currentUserId,
  isAdmin,
  agents,
}: {
  initialLeads: LeadWithRelations[];
  currentUserId: string;
  isAdmin: boolean;
  agents: Agent[];
}) {
  const [leads, setLeads] = useState(initialLeads);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const router = useRouter();

  function canEdit(lead: LeadWithRelations) {
    return isAdmin || lead.assignedToId === currentUserId;
  }

  function moveLead(leadId: string, stage: PipelineStage) {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stage } : l))
    );
    startTransition(async () => {
      try {
        await moveLeadStageAction(leadId, stage);
        router.refresh();
      } catch {
        router.refresh(); // resync with server truth on failure
      }
    });
  }

  function assignLead(leadId: string, assignedToId: string) {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? {
              ...l,
              assignedToId,
              stage: l.stage === "NOUVEAU" ? "CONTACTE" : l.stage,
            }
          : l
      )
    );
    startTransition(async () => {
      try {
        await assignLeadAction(leadId, assignedToId);
        router.refresh();
      } catch {
        router.refresh();
      }
    });
  }

  const unassigned = leads.filter((l) => l.assignedToId === null);

  return (
    <div>
      {isAdmin && unassigned.length > 0 && (
        <div className="mb-6 rounded-sm border border-brass/30 bg-brass/5 p-4">
          <p className="text-sm font-medium text-brass-dark">
            {unassigned.length} lead{unassigned.length > 1 ? "s" : ""} en
            file d&apos;attente — à répartir
          </p>
          <div className="mt-3 space-y-2">
            {unassigned.map((lead) => (
              <div
                key={lead.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-sm bg-white p-3"
              >
                <div>
                  <p className="text-sm font-medium text-ink">{lead.name}</p>
                  <p className="text-xs text-ink-60">
                    {sourceLabels[lead.source]} · {lead.city}
                  </p>
                </div>
                <select
                  className="h-9 rounded-sm border border-stone-line bg-white px-2 text-sm"
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) assignLead(lead.id, e.target.value);
                  }}
                >
                  <option value="" disabled>
                    Assigner à...
                  </option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto pb-4">
        {stageOrder.map((stage) => {
          const stageLeads = leads.filter((l) => l.stage === stage);
          return (
            <div
              key={stage}
              className={cn(
                "w-64 shrink-0 rounded-sm border border-stone-line bg-stone-100/60 p-3",
                draggingId && "outline-dashed outline-1 outline-stone-line"
              )}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (draggingId) {
                  const lead = leads.find((l) => l.id === draggingId);
                  if (lead && canEdit(lead)) moveLead(draggingId, stage);
                }
                setDraggingId(null);
              }}
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-ink-60">
                  {stageLabels[stage]}
                </p>
                <span className="font-mono text-xs text-ink-60">
                  {stageLeads.length}
                </span>
              </div>

              <div className="space-y-2">
                {stageLeads.map((lead) => {
                  const editable = canEdit(lead);
                  const agent = agents.find((a) => a.id === lead.assignedToId);
                  return (
                    <Link
                      key={lead.id}
                      href={`/admin/leads/${lead.id}`}
                      draggable={editable}
                      onDragStart={() => editable && setDraggingId(lead.id)}
                      onDragEnd={() => setDraggingId(null)}
                      className={cn(
                        "block rounded-sm border border-stone-line bg-white p-3 transition-shadow hover:shadow-sm",
                        editable ? "cursor-grab active:cursor-grabbing" : "opacity-80"
                      )}
                    >
                      <p className="text-sm font-medium text-ink">
                        {lead.name}
                      </p>
                      {lead.city && (
                        <p className="text-xs text-ink-60">{lead.city}</p>
                      )}
                      <div className="mt-2 flex items-center justify-between">
                        <Badge variant="outline" className="text-[10px]">
                          {sourceLabels[lead.source]}
                        </Badge>
                        {agent && (
                          <span className="text-[11px] text-ink-60">
                            {agent.name.split(" ")[0]}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-ink-60">
        Glisser-déposer une carte pour changer son étape. Les modifications
        sont enregistrées en base de données.
      </p>
    </div>
  );
}
