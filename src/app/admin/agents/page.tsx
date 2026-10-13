import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getAllUsers } from "@/lib/data/users";
import { AgentsTable } from "@/components/admin/agents-table";
import { NewAgentForm } from "@/components/admin/new-agent-form";

export default async function AgentsPage() {
  const session = await auth();
  const user = session!.user;

  if (user.role !== "ADMIN") {
    redirect("/admin");
  }

  const users = await getAllUsers();

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl text-ink">Agents</h1>
      <p className="mt-1 text-sm text-ink-60">
        Gère les comptes de l&apos;agence : rôles et accès.
      </p>

      <div className="mt-6">
        <AgentsTable initial={users} currentUserId={user.id} />
      </div>

      <h2 className="mt-10 font-display text-lg text-ink">
        Créer un nouveau compte
      </h2>
      <div className="mt-3">
        <NewAgentForm />
      </div>
    </div>
  );
}
