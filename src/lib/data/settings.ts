import { prisma } from "@/lib/prisma";

const SINGLETON_ID = "singleton";

export async function getAgencySettings() {
  const existing = await prisma.agencySettings.findUnique({
    where: { id: SINGLETON_ID },
  });
  if (existing) return existing;
  // First read ever: create the row with schema defaults so it always exists.
  return prisma.agencySettings.create({ data: { id: SINGLETON_ID } });
}

export interface UpdateAgencySettingsInput {
  name: string;
  tagline: string;
  addressLine: string;
  city: string;
  postalCode: string;
  phone: string;
  whatsapp: string;
  email: string;
  logoUrl?: string;
}

export async function updateAgencySettings(input: UpdateAgencySettingsInput) {
  return prisma.agencySettings.upsert({
    where: { id: SINGLETON_ID },
    update: input,
    create: { id: SINGLETON_ID, ...input },
  });
}
