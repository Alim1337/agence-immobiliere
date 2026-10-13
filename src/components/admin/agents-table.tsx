"use client";

import { useEffect, useState, useTransition } from "react";
import type { Role, User } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { roleLabels } from "@/lib/format";
import { toggleUserActiveAction, updateUserRoleAction } from "@/app/actions/users";

export function AgentsTable({
  initial,
  currentUserId,
}: {
  initial: User[];
  currentUserId: string;
}) {
  const [users, setUsers] = useState(initial);
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUsers(initial);
  }, [initial]);

  function toggleActive(userId: string) {
    setError(null);
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, active: !u.active } : u))
    );
    startTransition(async () => {
      try {
        await toggleUserActiveAction(userId);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur");
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, active: !u.active } : u))
        );
      }
    });
  }

  function changeRole(userId: string, role: Role) {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
    startTransition(async () => {
      await updateUserRoleAction(userId, role);
    });
  }

  return (
    <div>
      {error && (
        <p className="mb-3 rounded-sm bg-alert/10 px-3 py-2 text-sm text-alert">
          {error}
        </p>
      )}
      <div className="overflow-x-auto rounded-sm border border-stone-line bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-line text-left text-xs uppercase tracking-wide text-ink-60">
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Rôle</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Actif</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-stone-line last:border-0">
                <td className="px-4 py-3 font-medium text-ink">
                  {u.name}
                  {u.id === currentUserId && (
                    <span className="ml-2 text-xs text-ink-60">(vous)</span>
                  )}
                </td>
                <td className="px-4 py-3 text-ink-60">{u.email}</td>
                <td className="px-4 py-3">
                  <Select
                    value={u.role}
                    onChange={(e) => changeRole(u.id, e.target.value as Role)}
                    disabled={u.id === currentUserId}
                    className="h-9 w-44"
                  >
                    <option value="ADMIN">{roleLabels.ADMIN}</option>
                    <option value="AGENT">{roleLabels.AGENT}</option>
                    <option value="ASSISTANT">{roleLabels.ASSISTANT}</option>
                  </Select>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={u.active ? "pine" : "outline"}>
                    {u.active ? "Actif" : "Désactivé"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActive(u.id)}
                    disabled={u.id === currentUserId}
                    className={cn(
                      "relative h-6 w-11 rounded-full transition-colors disabled:opacity-40",
                      u.active ? "bg-pine" : "bg-stone-line"
                    )}
                    aria-label={u.active ? "Désactiver" : "Réactiver"}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                        u.active ? "translate-x-5" : "translate-x-0.5"
                      )}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
