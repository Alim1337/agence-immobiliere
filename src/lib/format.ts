import type {
  PropertyKind,
  PropertyStatus,
  PipelineStage,
  LeadSource,
  InteractionType,
  Role,
} from "@prisma/client";

export function formatPrice(price: number, kind: PropertyKind) {
  const formatted = new Intl.NumberFormat("fr-FR").format(price);
  return kind === "LOCATION" ? `${formatted} DA / mois` : `${formatted} DA`;
}

export const kindLabels: Record<PropertyKind, string> = {
  VENTE: "Vente",
  LOCATION: "Location",
  NEUF: "Programme neuf",
};

export const statusLabels: Record<PropertyStatus, string> = {
  DISPONIBLE: "Disponible",
  SOUS_OFFRE: "Sous offre",
  VENDU: "Vendu",
  LOUE: "Loué",
};

export const stageLabels: Record<PipelineStage, string> = {
  NOUVEAU: "Nouveau",
  CONTACTE: "Contacté",
  QUALIFIE: "Qualifié",
  VISITE_PLANIFIEE: "Visite planifiée",
  OFFRE: "Offre",
  SIGNE: "Signé",
  PERDU: "Perdu",
};

export const stageOrder: PipelineStage[] = [
  "NOUVEAU",
  "CONTACTE",
  "QUALIFIE",
  "VISITE_PLANIFIEE",
  "OFFRE",
  "SIGNE",
];

export const sourceLabels: Record<LeadSource, string> = {
  SITE_WEB: "Site web",
  TELEPHONE: "Téléphone",
  PORTAIL_ANNONCE: "Portail d'annonce",
  RECOMMANDATION: "Recommandation",
  AUTRE: "Autre",
};

export const interactionTypeLabels: Record<InteractionType, string> = {
  APPEL: "Appel",
  EMAIL: "Email",
  NOTE: "Note",
  VISITE: "Visite",
};

export const roleLabels: Record<Role, string> = {
  ADMIN: "Directeur d'agence",
  AGENT: "Agent commercial",
  ASSISTANT: "Assistant(e)",
};
