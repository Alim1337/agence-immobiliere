"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import * as tasksData from "@/lib/data/tasks";

async function requireSession() {
  const session = await auth();
  if (!session) throw new Error("Non authentifié");
  return session.user;
}

export async function createTaskAction(
  leadId: string,
  title: string,
  dueDate: string
) {
  const user = await requireSession();
  if (!title.trim() || !dueDate) return;
  await tasksData.createTask({
    title,
    dueDate: new Date(dueDate),
    leadId,
    userId: user.id,
  });
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin");
}

export async function toggleTaskDoneAction(taskId: string, leadId?: string) {
  await requireSession();
  await tasksData.toggleTaskDone(taskId);
  if (leadId) revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin");
}
