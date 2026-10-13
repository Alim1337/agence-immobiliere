"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createTaskAction, toggleTaskDoneAction } from "@/app/actions/tasks";

interface DisplayTask {
  id: string;
  title: string;
  dueDate: string | Date;
  done: boolean;
}

function defaultDueDate() {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().slice(0, 10);
}

export function TaskList({
  leadId,
  initial,
}: {
  leadId: string;
  initial: DisplayTask[];
}) {
  const [tasks, setTasks] = useState(initial);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(defaultDueDate());
  const [, startTransition] = useTransition();
  const router = useRouter();

  function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const localId = `local-${Date.now()}`;
    setTasks((prev) => [
      ...prev,
      { id: localId, title, dueDate, done: false },
    ]);
    const t = title;
    const d = dueDate;
    setTitle("");
    startTransition(async () => {
      await createTaskAction(leadId, t, d);
      router.refresh();
    });
  }

  function toggle(taskId: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t))
    );
    startTransition(async () => {
      await toggleTaskDoneAction(taskId, leadId);
    });
  }

  const sorted = [...tasks].sort((a, b) =>
    new Date(a.dueDate) < new Date(b.dueDate) ? -1 : 1
  );

  return (
    <div>
      <form onSubmit={addTask} className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Rappeler dans 3 jours..."
          className="h-10 flex-1 rounded-sm border border-stone-line bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:border-pine"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="h-10 rounded-sm border border-stone-line bg-white px-2 text-sm"
        />
        <Button type="submit" size="icon" aria-label="Ajouter">
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      <ul className="mt-4 space-y-2">
        {sorted.length === 0 && (
          <p className="text-sm text-ink-60">Aucune tâche pour ce lead.</p>
        )}
        {sorted.map((task) => {
          const overdue = !task.done && new Date(task.dueDate) < new Date(new Date().toDateString());
          return (
            <li
              key={task.id}
              className="flex items-center gap-3 rounded-sm border border-stone-line bg-white p-3"
            >
              <button
                onClick={() => toggle(task.id)}
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border",
                  task.done ? "border-pine bg-pine" : "border-stone-line"
                )}
                aria-label={task.done ? "Marquer non fait" : "Marquer fait"}
              >
                {task.done && (
                  <svg viewBox="0 0 12 12" className="h-3 w-3 fill-stone">
                    <path d="M4.5 8.5 1.5 5.5l1-1 2 2 4-4 1 1z" />
                  </svg>
                )}
              </button>
              <div className="flex-1">
                <p className={cn("text-sm text-ink", task.done && "line-through text-ink-60")}>
                  {task.title}
                </p>
              </div>
              <p className={cn("font-mono text-xs", overdue ? "text-alert" : "text-ink-60")}>
                {new Intl.DateTimeFormat("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                }).format(new Date(task.dueDate))}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
