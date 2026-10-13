export type PropertyStatus = "disponible" | "sous_offre" | "vendu" | "loue";
export type PropertyKind = "vente" | "location" | "neuf";
export type PropertyCategory =
  | "appartement"
  | "maison"
  | "terrain"
  | "local_commercial";

export interface Agent {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  photoUrl: string;
}

export interface Property {
  id: string;
  reference: string; // ex: "4521"
  title: string;
  kind: PropertyKind;
  category: PropertyCategory;
  status: PropertyStatus;
  price: number;
  city: string;
  postalCode: string;
  surface: number;
  rooms: number;
  bedrooms: number;
  dpe: "A" | "B" | "C" | "D" | "E" | "F" | "G";
  description: string;
  images: string[];
  agentId: string;
  featured?: boolean;
}
