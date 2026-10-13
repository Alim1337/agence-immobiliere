import { prisma } from "@/lib/prisma";

export async function getAppointments({
  userId,
  isAdmin,
}: {
  userId: string;
  isAdmin: boolean;
}) {
  return prisma.appointment.findMany({
    where: isAdmin ? {} : { userId },
    include: { lead: true, property: true, user: true },
    orderBy: { date: "asc" },
  });
}
