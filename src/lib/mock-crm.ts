export type PipelineStage =
  | "nouveau"
  | "contacte"
  | "qualifie"
  | "visite_planifiee"
  | "offre"
  | "signe"
  | "perdu";

export type LeadSource =
  | "site_web"
  | "telephone"
  | "portail_annonce"
  | "recommandation"
  | "autre";

export type InteractionType = "appel" | "email" | "note" | "visite";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: LeadSource;
  stage: PipelineStage;
  budgetMin?: number;
  budgetMax?: number;
  city?: string;
  assignedToId: string | null; // null = file d'attente, non assigné
  propertyId?: string;
  createdAt: string;
}

export interface Interaction {
  id: string;
  leadId: string;
  type: InteractionType;
  content: string;
  userId: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  leadId: string;
  propertyId: string;
  userId: string;
  date: string; // ISO
  notes?: string;
}

export const stageLabels: Record<PipelineStage, string> = {
  nouveau: "Nouveau",
  contacte: "Contacté",
  qualifie: "Qualifié",
  visite_planifiee: "Visite planifiée",
  offre: "Offre",
  signe: "Signé",
  perdu: "Perdu",
};

export const stageOrder: PipelineStage[] = [
  "nouveau",
  "contacte",
  "qualifie",
  "visite_planifiee",
  "offre",
  "signe",
];

export const sourceLabels: Record<LeadSource, string> = {
  site_web: "Site web",
  telephone: "Téléphone",
  portail_annonce: "Portail d'annonce",
  recommandation: "Recommandation",
  autre: "Autre",
};

export let leads: Lead[] = [
  {
    id: "l1",
    name: "Sophie Marchand",
    email: "sophie.marchand@example.com",
    phone: "06 12 34 56 78",
    source: "site_web",
    stage: "nouveau",
    budgetMin: 350000,
    budgetMax: 420000,
    city: "Lyon 6e",
    assignedToId: null,
    propertyId: "p1",
    createdAt: "2026-07-24",
  },
  {
    id: "l2",
    name: "Karim Idrissi",
    email: "karim.idrissi@example.com",
    phone: "06 98 76 54 32",
    source: "portail_annonce",
    stage: "nouveau",
    budgetMin: 250000,
    budgetMax: 300000,
    city: "Villeurbanne",
    assignedToId: null,
    createdAt: "2026-07-25",
  },
  {
    id: "l3",
    name: "Julie Fontaine",
    email: "julie.fontaine@example.com",
    phone: "07 11 22 33 44",
    source: "telephone",
    stage: "contacte",
    budgetMin: 300000,
    budgetMax: 350000,
    city: "Charbonnières-les-Bains",
    assignedToId: "a3",
    propertyId: "p2",
    createdAt: "2026-07-18",
  },
  {
    id: "l4",
    name: "Thomas Le Gall",
    email: "thomas.legall@example.com",
    phone: "06 55 44 33 22",
    source: "site_web",
    stage: "qualifie",
    budgetMin: 600,
    budgetMax: 750,
    city: "Lyon 3e",
    assignedToId: "a2",
    propertyId: "p3",
    createdAt: "2026-07-15",
  },
  {
    id: "l5",
    name: "Amandine Roy",
    email: "amandine.roy@example.com",
    phone: "06 21 43 65 87",
    source: "recommandation",
    stage: "visite_planifiee",
    budgetMin: 270000,
    budgetMax: 300000,
    city: "Villeurbanne",
    assignedToId: "a1",
    propertyId: "p4",
    createdAt: "2026-07-10",
  },
  {
    id: "l6",
    name: "Pierre-Alain Dubosc",
    email: "pa.dubosc@example.com",
    phone: "06 33 22 11 00",
    source: "site_web",
    stage: "offre",
    budgetMin: 480000,
    budgetMax: 520000,
    city: "Lyon 7e",
    assignedToId: "a3",
    propertyId: "p5",
    createdAt: "2026-06-28",
  },
  {
    id: "l7",
    name: "Nathalie Perrin",
    email: "nathalie.perrin@example.com",
    phone: "07 66 77 88 99",
    source: "portail_annonce",
    stage: "signe",
    budgetMin: 400000,
    budgetMax: 430000,
    city: "Lyon 6e",
    assignedToId: "a2",
    createdAt: "2026-06-10",
  },
  {
    id: "l8",
    name: "Bruno Ferrand",
    email: "bruno.ferrand@example.com",
    phone: "06 44 55 66 77",
    source: "autre",
    stage: "perdu",
    city: "Lyon 2e",
    assignedToId: "a1",
    propertyId: "p6",
    createdAt: "2026-06-02",
  },
];

export const interactions: Interaction[] = [
  {
    id: "i1",
    leadId: "l3",
    type: "appel",
    content:
      "Premier contact, très intéressée par le jardin. Rappeler après sa visite chez le notaire.",
    userId: "a3",
    createdAt: "2026-07-19",
  },
  {
    id: "i2",
    leadId: "l4",
    type: "email",
    content: "Envoi de 3 biens similaires dans son budget, en attente de retour.",
    userId: "a2",
    createdAt: "2026-07-16",
  },
  {
    id: "i3",
    leadId: "l5",
    type: "visite",
    content: "Visite du programme neuf, très emballée par le T3 exposé sud.",
    userId: "a1",
    createdAt: "2026-07-20",
  },
];

export const appointments: Appointment[] = [
  {
    id: "ap1",
    leadId: "l5",
    propertyId: "p4",
    userId: "a1",
    date: "2026-07-28T10:00:00",
    notes: "Deuxième visite, avec son conjoint.",
  },
  {
    id: "ap2",
    leadId: "l3",
    propertyId: "p2",
    userId: "a3",
    date: "2026-07-28T14:30:00",
  },
  {
    id: "ap3",
    leadId: "l6",
    propertyId: "p5",
    userId: "a3",
    date: "2026-07-29T09:00:00",
    notes: "Signature de l'offre d'achat.",
  },
];

export function getInteractionsForLead(leadId: string) {
  return interactions
    .filter((i) => i.leadId === leadId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getAppointmentsForUser(userId: string) {
  return appointments.filter((a) => a.userId === userId);
}
