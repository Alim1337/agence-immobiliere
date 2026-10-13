"use server";

import { revalidatePath } from "next/cache";
import { PropertyCategory, PropertyKind } from "@prisma/client";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import * as propertiesData from "@/lib/data/properties";

async function requireSession() {
  const session = await auth();
  if (!session) throw new Error("Non authentifié");
  return session.user;
}

export async function getFavoritePropertiesAction(ids: string[]) {
  return propertiesData.getPropertiesByIds(ids);
}

export async function togglePublishAction(propertyId: string) {
  await requireSession();
  await propertiesData.togglePropertyPublished(propertyId);
  revalidatePath("/admin/biens");
  revalidatePath("/biens");
  revalidatePath("/");
}

export async function updatePropertyAction(
  propertyId: string,
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireSession();

  const title = formData.get("title") as string;
  const kind = formData.get("kind") as PropertyKind;
  const category = formData.get("category") as PropertyCategory;
  const city = formData.get("city") as string;
  const postalCode = formData.get("postalCode") as string;
  const price = Number(formData.get("price"));
  const surface = Number(formData.get("surface"));
  const rooms = Number(formData.get("rooms"));
  const description = formData.get("description") as string;
  const ownerName = (formData.get("ownerName") as string) || undefined;
  const ownerPhone = (formData.get("ownerPhone") as string) || undefined;
  const ownerEmail = (formData.get("ownerEmail") as string) || undefined;
  const latRaw = formData.get("latitude") as string;
  const lngRaw = formData.get("longitude") as string;
  const latitude = latRaw ? Number(latRaw) : undefined;
  const longitude = lngRaw ? Number(lngRaw) : undefined;

  if (!title || !kind || !category || !city || !description) {
    return { error: "Merci de remplir tous les champs obligatoires." };
  }

  await propertiesData.updateProperty(propertyId, {
    title,
    kind,
    category,
    city,
    postalCode,
    price,
    surface,
    rooms,
    description,
    ownerName,
    ownerPhone,
    ownerEmail,
    latitude,
    longitude,
  });

  revalidatePath("/admin/biens");
  revalidatePath(`/admin/biens/${propertyId}`);
  revalidatePath(`/biens/${propertyId}`);
  return {};
}

export async function addPropertyImagesAction(
  propertyId: string,
  urls: string[]
) {
  await requireSession();
  await propertiesData.addPropertyImages(propertyId, urls);
  revalidatePath(`/admin/biens/${propertyId}`);
  revalidatePath(`/biens/${propertyId}`);
}

export async function deletePropertyImageAction(
  imageId: string,
  propertyId: string
) {
  await requireSession();
  await propertiesData.deletePropertyImage(imageId);
  revalidatePath(`/admin/biens/${propertyId}`);
  revalidatePath(`/biens/${propertyId}`);
}
export async function createPropertyAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  const user = await requireSession();

  const title = formData.get("title") as string;
  const kind = formData.get("kind") as PropertyKind;
  const category = formData.get("category") as PropertyCategory;
  const city = formData.get("city") as string;
  const postalCode = formData.get("postalCode") as string;
  const price = Number(formData.get("price"));
  const surface = Number(formData.get("surface"));
  const rooms = Number(formData.get("rooms"));
  const description = formData.get("description") as string;
  const imagesRaw = formData.get("images") as string | null;
  const ownerName = (formData.get("ownerName") as string) || undefined;
  const ownerPhone = (formData.get("ownerPhone") as string) || undefined;
  const ownerEmail = (formData.get("ownerEmail") as string) || undefined;
  const latRaw = formData.get("latitude") as string;
  const lngRaw = formData.get("longitude") as string;
  const latitude = latRaw ? Number(latRaw) : undefined;
  const longitude = lngRaw ? Number(lngRaw) : undefined;

  if (!title || !kind || !category || !city || !description) {
    return { error: "Merci de remplir tous les champs obligatoires." };
  }

  let imageUrls: string[] = [];
  if (imagesRaw) {
    try {
      const parsed = JSON.parse(imagesRaw);
      if (Array.isArray(parsed)) imageUrls = parsed.filter((u) => typeof u === "string");
    } catch {
      // ignore malformed payload, just create the property without photos
    }
  }

  const property = await propertiesData.createProperty({
    title,
    kind,
    category,
    city,
    postalCode,
    price,
    surface,
    rooms,
    description,
    agentId: user.id,
    imageUrls,
    ownerName,
    ownerPhone,
    ownerEmail,
    latitude,
    longitude,
  });

  revalidatePath("/admin/biens");
  redirect(`/admin/biens`);
  return { property };
}
