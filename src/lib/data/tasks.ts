import { prisma } from "@/lib/prisma";

export async function getTasksForLead(leadId: string) {
  return prisma.task.findMany({
    where: { leadId },
    orderBy: { dueDate: "asc" },
  });
}

export async function getUpcomingTasks({
  userId,
  isAdmin,
}: {
  userId: string;
  isAdmin: boolean;
}) {
  return prisma.task.findMany({
    where: {
      done: false,
      ...(isAdmin ? {} : { userId }),
    },
    include: { lead: true },
    orderBy: { dueDate: "asc" },
    take: 6,
  });
}

export async function createTask(input: {
  title: string;
  dueDate: Date;
  leadId?: string;
  userId: string;
}) {
  return prisma.task.create({ data: input });
}

export async function toggleTaskDone(taskId: string) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new Error("Tâche introuvable");
  return prisma.task.update({
    where: { id: taskId },
    data: { done: !task.done },
  });
}
