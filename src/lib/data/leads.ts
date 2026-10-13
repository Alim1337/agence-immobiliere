import { prisma } from "@/lib/prisma";
import { PipelineStage, InteractionType, Role } from "@prisma/client";

export async function getLeads() {
  return prisma.lead.findMany({
    include: { assignedTo: true, property: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getLeadById(id: string) {
  return prisma.lead.findUnique({
    where: { id },
    include: {
      assignedTo: true,
      property: true,
      interactions: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

// Agents available for assignment (admin + agent roles; assistants don't carry a lead portfolio)
export async function getAssignableAgents() {
  return prisma.user.findMany({
    where: { role: { in: [Role.ADMIN, Role.AGENT] } },
    orderBy: { name: "asc" },
  });
}

export async function getAllAgents() {
  return prisma.user.findMany({ orderBy: { name: "asc" } });
}

// --- Mutations -------------------------------------------------------------

export async function assignLead(leadId: string, assignedToId: string) {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) throw new Error("Lead introuvable");
  return prisma.lead.update({
    where: { id: leadId },
    data: {
      assignedToId,
      // moving a queued lead out of NOUVEAU once it's picked up
      stage: lead.stage === "NOUVEAU" ? "CONTACTE" : lead.stage,
    },
  });
}

interface StageChangeActor {
  userId: string;
  isAdmin: boolean;
}

export async function moveLeadStage(
  leadId: string,
  stage: PipelineStage,
  actor: StageChangeActor
) {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) throw new Error("Lead introuvable");
  if (!actor.isAdmin && lead.assignedToId !== actor.userId) {
    throw new Error("Vous ne pouvez modifier que vos propres leads.");
  }
  return prisma.lead.update({ where: { id: leadId }, data: { stage } });
}

export async function addInteraction(
  leadId: string,
  userId: string,
  type: InteractionType,
  content: string
) {
  return prisma.interaction.create({
    data: { leadId, userId, type, content },
  });
}
