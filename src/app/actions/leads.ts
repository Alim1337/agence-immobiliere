"use server";

import { revalidatePath } from "next/cache";
import { InteractionType, PipelineStage } from "@prisma/client";
import { auth } from "@/auth";
import * as leadsData from "@/lib/data/leads";

async function requireSession() {
  const session = await auth();
  if (!session) throw new Error("Non authentifié");
  return session.user;
}

export async function assignLeadAction(leadId: string, userId: string) {
  const user = await requireSession();
  if (user.role !== "ADMIN") {
    throw new Error("Seul un administrateur peut répartir les leads.");
  }
  await leadsData.assignLead(leadId, userId);
  revalidatePath("/admin/leads");
}

export async function moveLeadStageAction(leadId: string, stage: PipelineStage) {
  const user = await requireSession();
  await leadsData.moveLeadStage(leadId, stage, {
    userId: user.id,
    isAdmin: user.role === "ADMIN",
  });
  revalidatePath("/admin/leads");
}

export async function addInteractionAction(
  leadId: string,
  type: InteractionType,
  content: string
) {
  const user = await requireSession();
  if (!content.trim()) return;
  await leadsData.addInteraction(leadId, user.id, type, content);
  revalidatePath(`/admin/leads/${leadId}`);
}
