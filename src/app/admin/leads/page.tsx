import { auth } from "@/auth";
import { getLeads, getAssignableAgents } from "@/lib/data/leads";
import { LeadsKanban } from "@/components/admin/leads-kanban";

export default async function LeadsPage() {
  const session = await auth();
  const user = session!.user;

  const [leads, agents] = await Promise.all([
    getLeads(),
    getAssignableAgents(),
  ]);

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl text-ink">Pipeline des leads</h1>
      <p className="mt-1 text-sm text-ink-60">
        {user.role === "ADMIN"
          ? "Vue complète de l'agence — répartissez la file d'attente et suivez chaque dossier."
          : "Vous pouvez déplacer vos propres leads. Les leads des autres agents sont visibles en lecture seule."}
      </p>

      <div className="mt-6">
        <LeadsKanban
          initialLeads={leads}
          currentUserId={user.id}
          isAdmin={user.role === "ADMIN"}
          agents={agents.map((a) => ({ id: a.id, name: a.name }))}
        />
      </div>
    </div>
  );
}
