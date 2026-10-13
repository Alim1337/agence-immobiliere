import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getLeads } from "@/lib/data/leads";
import { getAppointments } from "@/lib/data/appointments";
import { getUpcomingTasks } from "@/lib/data/tasks";
import { stageLabels, stageOrder } from "@/lib/format";
import { CalendarClock, TrendingUp, Users, Home, ListChecks } from "lucide-react";

export default async function AdminDashboard() {
  const session = await auth();
  const user = session!.user;
  const isAdmin = user.role === "ADMIN";

  const [leads, availableProperties, appointments, tasks] = await Promise.all([
    getLeads(),
    prisma.property.count({ where: { status: "DISPONIBLE" } }),
    getAppointments({ userId: user.id, isAdmin }),
    getUpcomingTasks({ userId: user.id, isAdmin }),
  ]);

  const myLeads = isAdmin ? leads : leads.filter((l) => l.assignedToId === user.id);
  const unassigned = leads.filter((l) => l.assignedToId === null).length;
  const signed = leads.filter((l) => l.stage === "SIGNE").length;
  const conversionRate = leads.length
    ? Math.round((signed / leads.length) * 100)
    : 0;

  const upcoming = appointments
    .filter((a) => a.date >= new Date())
    .slice(0, 4);

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl text-ink">
        Bonjour, {user.name?.split(" ")[0]}
      </h1>
      <p className="mt-1 text-sm text-ink-60">
        Voici l&apos;activité de {isAdmin ? "l'agence" : "votre portefeuille"}.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          icon={<Users className="h-5 w-5" strokeWidth={1.5} />}
          label={isAdmin ? "Leads en file d'attente" : "Mes leads actifs"}
          value={isAdmin ? unassigned : myLeads.length}
          hint={isAdmin ? "Non assignés" : undefined}
        />
        <Kpi
          icon={<TrendingUp className="h-5 w-5" strokeWidth={1.5} />}
          label="Taux de conversion"
          value={`${conversionRate}%`}
          hint="Signés / total des leads"
        />
        <Kpi
          icon={<Home className="h-5 w-5" strokeWidth={1.5} />}
          label="Biens disponibles"
          value={availableProperties}
        />
        <Kpi
          icon={<CalendarClock className="h-5 w-5" strokeWidth={1.5} />}
          label="Rendez-vous à venir"
          value={upcoming.length}
        />
        <Kpi
          icon={<ListChecks className="h-5 w-5" strokeWidth={1.5} />}
          label="Relances à faire"
          value={tasks.length}
        />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="rounded-sm border border-stone-line bg-white p-6">
          <h2 className="font-display text-lg text-ink">
            Relances à faire
          </h2>
          <ul className="mt-4 space-y-3">
            {tasks.length === 0 && (
              <p className="text-sm text-ink-60">Aucune relance en attente.</p>
            )}
            {tasks.map((t) => {
              const content = (
                <>
                  <div>
                    <p className="text-sm font-medium text-ink">{t.title}</p>
                    {t.lead && <p className="text-xs text-ink-60">{t.lead.name}</p>}
                  </div>
                  <p className="font-mono text-xs text-ink-60">
                    {new Intl.DateTimeFormat("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                    }).format(t.dueDate)}
                  </p>
                </>
              );
              return (
                <li key={t.id}>
                  {t.leadId ? (
                    <Link
                      href={`/admin/leads/${t.leadId}`}
                      className="flex items-center justify-between border-b border-stone-line pb-3 last:border-0 last:pb-0 hover:text-pine-dark"
                    >
                      {content}
                    </Link>
                  ) : (
                    <div className="flex items-center justify-between border-b border-stone-line pb-3 last:border-0 last:pb-0">
                      {content}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-sm border border-stone-line bg-white p-6">
          <h2 className="font-display text-lg text-ink">
            Prochains rendez-vous
          </h2>
          <ul className="mt-4 space-y-3">
            {upcoming.length === 0 && (
              <p className="text-sm text-ink-60">Aucun rendez-vous planifié.</p>
            )}
            {upcoming.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between border-b border-stone-line pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium text-ink">
                    {a.lead.name}
                  </p>
                  <p className="text-xs text-ink-60">{a.notes}</p>
                </div>
                <p className="font-mono text-xs text-ink-60">
                  {new Intl.DateTimeFormat("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(a.date)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-sm border border-stone-line bg-white p-6">
          <h2 className="font-display text-lg text-ink">
            Répartition du pipeline
          </h2>
          <ul className="mt-4 space-y-2.5">
            {[...stageOrder, "PERDU" as const].map((stage) => {
              const count = leads.filter((l) => l.stage === stage).length;
              const pct = leads.length
                ? Math.round((count / leads.length) * 100)
                : 0;
              return (
                <li key={stage}>
                  <div className="flex justify-between text-xs text-ink-60">
                    <span>{stageLabels[stage]}</span>
                    <span>{count}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-stone-100">
                    <div
                      className="h-1.5 rounded-full bg-pine"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-sm border border-stone-line bg-white p-5">
      <span className="text-pine">{icon}</span>
      <p className="mt-3 font-mono text-2xl text-ink">{value}</p>
      <p className="text-sm text-ink-60">{label}</p>
      {hint && <p className="text-xs text-ink-60/70">{hint}</p>}
    </div>
  );
}
