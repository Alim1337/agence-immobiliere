import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { auth } from "@/auth";
import { getLeadById } from "@/lib/data/leads";
import { getMatchingProperties } from "@/lib/data/properties";
import { getTasksForLead } from "@/lib/data/tasks";
import { formatPrice, stageLabels, sourceLabels } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { InteractionTimeline } from "@/components/admin/interaction-timeline";
import { TaskList } from "@/components/admin/task-list";
import { PropertyImage } from "@/components/site/property-image";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [lead, tasks] = await Promise.all([
    getLeadById(id),
    getTasksForLead(id),
  ]);
  if (!lead) notFound();

  const matches = await getMatchingProperties(
    {
      budgetMin: lead.budgetMin,
      budgetMax: lead.budgetMax,
      city: lead.city,
    },
    4
  );
  const matchesExcludingOrigin = matches.filter(
    (m) => m.id !== lead.propertyId
  );

  const session = await auth();
  const user = session!.user;
  const canEdit = user.role === "ADMIN" || lead.assignedToId === user.id;

  return (
    <div className="p-8">
      <Link
        href="/admin/leads"
        className="flex items-center gap-1.5 text-sm text-ink-60 hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Pipeline
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl text-ink">{lead.name}</h1>
            <Badge variant="pine">{stageLabels[lead.stage]}</Badge>
          </div>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-ink-60">
            <span className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> {lead.email}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" /> {lead.phone}
            </span>
          </div>
        </div>
        {!canEdit && (
          <Badge variant="outline">
            Lecture seule — assigné à {lead.assignedTo?.name ?? "un autre agent"}
          </Badge>
        )}
      </div>

      <div className="mt-8 grid items-start gap-8 md:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          {lead.message && (
            <div className="rounded-sm border border-stone-line bg-white p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-ink-60">
                Message initial
              </p>
              <p className="mt-2 whitespace-pre-line text-sm text-ink">
                {lead.message}
              </p>
            </div>
          )}

          <div className="rounded-sm border border-stone-line bg-white p-6">
            <h2 className="font-display text-lg text-ink">Historique</h2>
            <div className="mt-4">
              <InteractionTimeline
                leadId={lead.id}
                initial={lead.interactions.map((i) => ({
                  id: i.id,
                  type: i.type,
                  content: i.content,
                  authorName: i.user.name,
                  createdAt: i.createdAt,
                }))}
                authorName={user.name ?? "Vous"}
              />
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-sm border border-stone-line bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-60">
              Relances
            </p>
            <div className="mt-3">
              <TaskList
                leadId={lead.id}
                initial={tasks.map((t) => ({
                  id: t.id,
                  title: t.title,
                  dueDate: t.dueDate,
                  done: t.done,
                }))}
              />
            </div>
          </div>

          <div className="rounded-sm border border-stone-line bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-60">
              Critères de recherche
            </p>
            <dl className="mt-3 space-y-2 text-sm">
              <Row label="Ville" value={lead.city ?? "—"} />
              <Row
                label="Budget"
                value={
                  lead.budgetMin && lead.budgetMax
                    ? `${new Intl.NumberFormat("fr-FR").format(
                        lead.budgetMin
                      )} – ${new Intl.NumberFormat("fr-FR").format(
                        lead.budgetMax
                      )} DA`
                    : lead.budgetMax
                    ? `Jusqu'à ${new Intl.NumberFormat("fr-FR").format(lead.budgetMax)} DA`
                    : lead.budgetMin
                    ? `À partir de ${new Intl.NumberFormat("fr-FR").format(lead.budgetMin)} DA`
                    : "—"
                }
              />
              <Row label="Source" value={sourceLabels[lead.source]} />
              <Row label="Agent" value={lead.assignedTo?.name ?? "Non assigné"} />
            </dl>
          </div>

          {lead.property && (
            <Link
              href={`/biens/${lead.property.id}`}
              className="block rounded-sm border border-stone-line bg-white p-5 hover:shadow-sm"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-ink-60">
                Bien d&apos;origine
              </p>
              <p className="mt-2 text-sm font-medium text-ink">
                {lead.property.title}
              </p>
              <p className="mt-1 font-mono text-sm text-brass-dark">
                {formatPrice(lead.property.price, lead.property.kind)}
              </p>
            </Link>
          )}
        </aside>
      </div>

      {matchesExcludingOrigin.length > 0 && (
        <div className="mt-10 border-t border-stone-line pt-8">
          <div className="flex items-center gap-2">
            <span className="dossier-tab rounded-sm px-2 py-1 text-[10px]">
              Suggestions
            </span>
            <h2 className="font-display text-lg text-ink">
              Biens correspondants
            </h2>
          </div>
          <p className="mt-1 text-sm text-ink-60">
            Basées sur le budget et la ville renseignés par le lead.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {matchesExcludingOrigin.map((property) => (
              <Link
                key={property.id}
                href={`/biens/${property.id}`}
                className="group block overflow-hidden rounded-sm border border-stone-line bg-white transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(28,35,33,0.25)]"
              >
                <PropertyImage images={property.images} className="h-32 w-full" />
                <div className="p-4">
                  <p className="text-sm font-medium text-ink group-hover:text-pine-dark">
                    {property.title}
                  </p>
                  <div className="mt-1.5 flex items-center justify-between text-xs text-ink-60">
                    <span>{property.city}</span>
                    <span>{property.surface} m²</span>
                  </div>
                  <p className="mt-2 border-t border-stone-line pt-2 font-mono text-sm text-brass-dark">
                    {formatPrice(property.price, property.kind)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-stone-line pb-2">
      <dt className="text-ink-60">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}
