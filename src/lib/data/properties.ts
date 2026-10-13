import { prisma } from "@/lib/prisma";
import { PropertyCategory, PropertyKind } from "@prisma/client";

export interface PropertyFilters {
  q?: string;
  kind?: PropertyKind;
  category?: PropertyCategory;
}

const imagesInclude = { images: { orderBy: { position: "asc" as const } } };

// --- Public site (only published properties) -----------------------------

export async function getPublicProperties(filters: PropertyFilters = {}) {
  return prisma.property.findMany({
    where: {
      published: true,
      kind: filters.kind,
      category: filters.category,
      ...(filters.q
        ? {
            OR: [
              { city: { contains: filters.q, mode: "insensitive" } },
              { title: { contains: filters.q, mode: "insensitive" } },
              { reference: { contains: filters.q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { agent: true, ...imagesInclude },
    orderBy: { createdAt: "desc" },
  });
}

export async function getFeaturedProperties(take = 4) {
  return prisma.property.findMany({
    where: { published: true },
    include: { agent: true, ...imagesInclude },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function getPublicPropertyById(id: string) {
  return prisma.property.findFirst({
    where: { id, published: true },
    include: { agent: true, ...imagesInclude },
  });
}

export async function getPropertiesByIds(ids: string[]) {
  if (ids.length === 0) return [];
  return prisma.property.findMany({
    where: { id: { in: ids }, published: true },
    include: { agent: true, ...imagesInclude },
  });
}

export async function getNeufPrograms() {
  return prisma.property.findMany({
    where: { published: true, kind: "NEUF" },
    include: { agent: true, ...imagesInclude },
    orderBy: { createdAt: "desc" },
  });
}

interface LeadCriteria {
  budgetMin?: number | null;
  budgetMax?: number | null;
  city?: string | null;
}

// Simple matching: published + available properties whose price falls
// within the lead's budget (with a 10% tolerance either way), prioritizing
// same-city matches. Not AI matching — just useful ordering for an agent.
export async function getMatchingProperties(lead: LeadCriteria, take = 4) {
  const priceFilter =
    lead.budgetMin != null || lead.budgetMax != null
      ? {
          price: {
            ...(lead.budgetMin != null
              ? { gte: Math.floor(lead.budgetMin * 0.9) }
              : {}),
            ...(lead.budgetMax != null
              ? { lte: Math.ceil(lead.budgetMax * 1.1) }
              : {}),
          },
        }
      : {};

  const candidates = await prisma.property.findMany({
    where: {
      published: true,
      status: "DISPONIBLE",
      ...priceFilter,
    },
    include: { agent: true, ...imagesInclude },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const cityNorm = lead.city?.toLowerCase().trim();
  const scored = candidates
    .map((p) => ({
      property: p,
      sameCity: cityNorm ? p.city.toLowerCase().includes(cityNorm) : false,
    }))
    .sort((a, b) => Number(b.sameCity) - Number(a.sameCity));

  return scored.slice(0, take).map((s) => s.property);
}

// --- Admin (all properties, regardless of publish status) ----------------

export async function getAllProperties() {
  return prisma.property.findMany({
    include: { agent: true, ...imagesInclude },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPropertyByIdAdmin(id: string) {
  return prisma.property.findUnique({
    where: { id },
    include: { agent: true, ...imagesInclude },
  });
}

export async function togglePropertyPublished(propertyId: string) {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });
  if (!property) throw new Error("Bien introuvable");
  return prisma.property.update({
    where: { id: propertyId },
    data: { published: !property.published },
  });
}

export interface CreatePropertyInput {
  title: string;
  kind: PropertyKind;
  category: PropertyCategory;
  city: string;
  postalCode: string;
  price: number;
  surface: number;
  rooms: number;
  bedrooms?: number;
  dpe?: string;
  description: string;
  agentId: string;
  imageUrls?: string[];
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  latitude?: number;
  longitude?: number;
}

function nextReference() {
  // Simple incrementing-ish reference: agency prefix + timestamp tail.
  return `${4500 + Math.floor(Math.random() * 500)}`;
}

export async function createProperty(input: CreatePropertyInput) {
  return prisma.property.create({
    data: {
      reference: nextReference(),
      title: input.title,
      kind: input.kind,
      category: input.category,
      status: "DISPONIBLE",
      price: input.price,
      city: input.city,
      postalCode: input.postalCode,
      surface: input.surface,
      rooms: input.rooms,
      bedrooms: input.bedrooms ?? 0,
      dpe: input.dpe,
      description: input.description,
      published: false,
      agentId: input.agentId,
      ownerName: input.ownerName,
      ownerPhone: input.ownerPhone,
      ownerEmail: input.ownerEmail,
      latitude: input.latitude,
      longitude: input.longitude,
      ...(input.imageUrls && input.imageUrls.length > 0
        ? {
            images: {
              create: input.imageUrls.map((url, i) => ({ url, position: i })),
            },
          }
        : {}),
    },
    include: { images: true },
  });
}

export interface UpdatePropertyInput {
  title: string;
  kind: PropertyKind;
  category: PropertyCategory;
  city: string;
  postalCode: string;
  price: number;
  surface: number;
  rooms: number;
  bedrooms?: number;
  dpe?: string;
  description: string;
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  latitude?: number;
  longitude?: number;
}

export async function updateProperty(id: string, input: UpdatePropertyInput) {
  return prisma.property.update({
    where: { id },
    data: input,
  });
}

export async function addPropertyImages(propertyId: string, urls: string[]) {
  const existingCount = await prisma.propertyImage.count({
    where: { propertyId },
  });
  return prisma.propertyImage.createMany({
    data: urls.map((url, i) => ({
      propertyId,
      url,
      position: existingCount + i,
    })),
  });
}

export async function deletePropertyImage(imageId: string) {
  return prisma.propertyImage.delete({ where: { id: imageId } });
}
