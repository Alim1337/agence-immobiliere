"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import * as settingsData from "@/lib/data/settings";

export interface SettingsFormState {
  error?: string;
}

export async function updateAgencySettingsAction(
  _prevState: SettingsFormState | undefined,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Réservé aux administrateurs." };
  }

  const name = formData.get("name") as string;
  const tagline = formData.get("tagline") as string;
  const addressLine = formData.get("addressLine") as string;
  const city = formData.get("city") as string;
  const postalCode = formData.get("postalCode") as string;
  const phone = formData.get("phone") as string;
  const whatsapp = formData.get("whatsapp") as string;
  const email = formData.get("email") as string;
  const logoUrl = (formData.get("logoUrl") as string) || undefined;

  if (!name || !addressLine || !city || !phone || !email) {
    return { error: "Merci de remplir tous les champs obligatoires." };
  }

  await settingsData.updateAgencySettings({
    name,
    tagline,
    addressLine,
    city,
    postalCode,
    phone,
    whatsapp,
    email,
    logoUrl,
  });

  revalidatePath("/", "layout");
  return {};
}
