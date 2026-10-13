"use server";

import { prisma } from "@/lib/prisma";

export interface PublicLeadFormState {
  success?: boolean;
  error?: string;
}

export async function submitPropertyContactAction(
  propertyId: string,
  _prevState: PublicLeadFormState | undefined,
  formData: FormData
): Promise<PublicLeadFormState> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();
  const budgetMinRaw = formData.get("budgetMin") as string;
  const budgetMaxRaw = formData.get("budgetMax") as string;
  const budgetMin = budgetMinRaw ? Number(budgetMinRaw) : undefined;
  const budgetMax = budgetMaxRaw ? Number(budgetMaxRaw) : undefined;

  if (!name || !email) {
    return { error: "Merci de renseigner au moins votre nom et votre email." };
  }

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });
  if (!property) {
    return { error: "Ce bien n'existe plus." };
  }

  await prisma.lead.create({
    data: {
      name,
      email,
      phone,
      message,
      source: "SITE_WEB",
      stage: "NOUVEAU",
      city: property.city,
      propertyId: property.id,
      budgetMin,
      budgetMax,
    },
  });

  return { success: true };
}

export async function submitGeneralContactAction(
  _prevState: PublicLeadFormState | undefined,
  formData: FormData
): Promise<PublicLeadFormState> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!name || !email) {
    return { error: "Merci de renseigner au moins votre nom et votre email." };
  }

  await prisma.lead.create({
    data: {
      name,
      email,
      phone,
      message,
      source: "SITE_WEB",
      stage: "NOUVEAU",
    },
  });

  return { success: true };
}

export async function submitEstimationAction(
  _prevState: PublicLeadFormState | undefined,
  formData: FormData
): Promise<PublicLeadFormState> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const address = (formData.get("address") as string)?.trim();
  const category = formData.get("category") as string;
  const purpose = formData.get("purpose") as string;
  const surface = formData.get("surface") as string;
  const rooms = formData.get("rooms") as string;

  if (!name || !email || !address) {
    return { error: "Merci de renseigner au moins l'adresse, votre nom et votre email." };
  }

  const categoryLabels: Record<string, string> = {
    appartement: "Appartement",
    maison: "Maison",
    terrain: "Terrain",
    local_commercial: "Local commercial",
  };
  const purposeLabels: Record<string, string> = {
    vendre: "Vendre",
    louer: "Louer",
  };

  const message = [
    `Demande d'estimation — ${categoryLabels[category] ?? category}`,
    `Souhaite : ${purposeLabels[purpose] ?? purpose}`,
    `Adresse : ${address}`,
    surface ? `Surface : ${surface} m²` : null,
    rooms ? `Pièces : ${rooms}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  await prisma.lead.create({
    data: {
      name,
      email,
      phone,
      message,
      source: "SITE_WEB",
      stage: "NOUVEAU",
      city: address,
    },
  });

  return { success: true };
}
