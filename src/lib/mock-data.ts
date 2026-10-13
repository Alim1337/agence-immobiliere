import { Agent, Property } from "./types";

export const agents: Agent[] = [
  {
    id: "a1",
    name: "Claire Vasseur",
    role: "Directrice d'agence",
    phone: "01 42 33 12 04",
    email: "claire.vasseur@maisonetfils.fr",
    photoUrl: "",
  },
  {
    id: "a2",
    name: "Nadir Belkacem",
    role: "Agent commercial",
    phone: "01 42 33 12 05",
    email: "nadir.belkacem@maisonetfils.fr",
    photoUrl: "",
  },
  {
    id: "a3",
    name: "Émilie Roussel",
    role: "Agente commerciale",
    phone: "01 42 33 12 06",
    email: "emilie.roussel@maisonetfils.fr",
    photoUrl: "",
  },
];

export const properties: Property[] = [
  {
    id: "p1",
    reference: "4521",
    title: "Appartement traversant avec vue dégagée",
    kind: "vente",
    category: "appartement",
    status: "disponible",
    price: 415000,
    city: "Lyon 6e",
    postalCode: "69006",
    surface: 78,
    rooms: 4,
    bedrooms: 3,
    dpe: "C",
    description:
      "Au 5e étage avec ascenseur, cet appartement traversant baigne dans la lumière du matin au soir. Double séjour, cuisine séparée équipée, trois chambres et un cellier. Cave et parking en sous-sol inclus.",
    images: [],
    agentId: "a2",
    featured: true,
  },
  {
    id: "p2",
    reference: "4498",
    title: "Maison de village avec jardin clos",
    kind: "vente",
    category: "maison",
    status: "disponible",
    price: 328000,
    city: "Charbonnières-les-Bains",
    postalCode: "69260",
    surface: 112,
    rooms: 5,
    bedrooms: 4,
    dpe: "D",
    description:
      "Ancienne bâtisse rénovée avec goût, poutres apparentes et cheminée en pierre. Jardin clos de 300 m² exposé sud, dépendance aménageable en atelier ou bureau.",
    images: [],
    agentId: "a3",
    featured: true,
  },
  {
    id: "p3",
    reference: "4534",
    title: "Studio lumineux proche métro",
    kind: "location",
    category: "appartement",
    status: "disponible",
    price: 690,
    city: "Lyon 3e",
    postalCode: "69003",
    surface: 24,
    rooms: 1,
    bedrooms: 0,
    dpe: "B",
    description:
      "Studio refait à neuf à deux minutes du métro Part-Dieu. Kitchenette équipée, salle d'eau moderne, rangements optimisés. Idéal premier logement ou investissement locatif.",
    images: [],
    agentId: "a2",
    featured: true,
  },
  {
    id: "p4",
    reference: "4560",
    title: "Programme neuf — Les Terrasses du Parc",
    kind: "neuf",
    category: "appartement",
    status: "disponible",
    price: 289000,
    city: "Villeurbanne",
    postalCode: "69100",
    surface: 62,
    rooms: 3,
    bedrooms: 2,
    dpe: "A",
    description:
      "Livraison T4 2027. Résidence à taille humaine face au parc, prestations soignées, larges balcons filants. Derniers lots disponibles du T2 au T4.",
    images: [],
    agentId: "a1",
    featured: true,
  },
  {
    id: "p5",
    reference: "4502",
    title: "Duplex avec terrasse",
    kind: "vente",
    category: "appartement",
    status: "sous_offre",
    price: 512000,
    city: "Lyon 7e",
    postalCode: "69007",
    surface: 95,
    rooms: 4,
    bedrooms: 3,
    dpe: "C",
    description:
      "Duplex au calme dans une copropriété récente, terrasse de 18 m² exposée ouest, parking double en sous-sol.",
    images: [],
    agentId: "a3",
  },
  {
    id: "p6",
    reference: "4511",
    title: "Local commercial avec vitrine",
    kind: "location",
    category: "local_commercial",
    status: "disponible",
    price: 1450,
    city: "Lyon 2e",
    postalCode: "69002",
    surface: 48,
    rooms: 2,
    bedrooms: 0,
    dpe: "D",
    description:
      "Emplacement passant, vitrine de 6 mètres linéaires, arrière-boutique et point d'eau. Idéal commerce de bouche ou concept-store.",
    images: [],
    agentId: "a1",
  },
];

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  authorId: string;
  publishedAt: string; // ISO date
  category: string;
}

export const articles: Article[] = [
  {
    slug: "prix-immobilier-lyon-2026",
    title: "Prix de l'immobilier à Lyon : ce qui change en 2026",
    excerpt:
      "Le marché lyonnais se stabilise après deux ans de baisse. Voici les tendances par arrondissement.",
    content: [
      "Après une correction marquée en 2024 et 2025, les prix se stabilisent dans la plupart des arrondissements lyonnais. Le 6e et le 2e restent les plus recherchés, tandis que le 7e et le 8e attirent une clientèle plus jeune en quête de surface.",
      "Les biens avec un bon DPE (A, B, C) se négocient désormais nettement plus vite que les passoires thermiques, qui subissent une décote pouvant atteindre 10 à 15 %.",
      "Pour les vendeurs, le message est clair : un bien bien positionné en prix dès la mise en vente se vend en moyenne deux fois plus vite qu'un bien surestimé puis rabaissé.",
    ],
    authorId: "a1",
    publishedAt: "2026-06-12",
    category: "Marché",
  },
  {
    slug: "diagnostic-dpe-obligations-2026",
    title: "DPE : ce qui est obligatoire avant de mettre en location",
    excerpt:
      "Les logements classés G sont désormais interdits à la location. Ce que ça change pour les propriétaires.",
    content: [
      "Depuis 2025, les logements classés G au DPE ne peuvent plus être proposés à la location. Cette interdiction concerne progressivement les classes F puis E dans les prochaines années.",
      "Pour les propriétaires concernés, plusieurs aides existent (MaPrimeRénov', éco-prêt à taux zéro) pour financer les travaux de rénovation énergétique.",
      "Notre conseil : faites réaliser un audit énergétique avant la mise en location ou en vente, cela évite les mauvaises surprises en cours de négociation.",
    ],
    authorId: "a3",
    publishedAt: "2026-05-28",
    category: "Réglementation",
  },
  {
    slug: "premiere-visite-conseils-acheteurs",
    title: "Première visite : les 7 points à vérifier absolument",
    excerpt:
      "Nos agents partagent leur check-list pour ne rien laisser passer lors d'une visite.",
    content: [
      "Une visite dure rarement plus de 20 minutes : autant savoir où regarder. Humidité, exposition, bruit, charges de copropriété, travaux votés à venir sont les points que nos agents vérifient systématiquement avec leurs clients.",
      "N'hésitez pas à demander les trois derniers procès-verbaux d'assemblée générale : ils révèlent souvent des travaux importants à venir, invisibles lors d'une simple visite.",
      "Enfin, revenez si possible à un autre moment de la journée : la luminosité et le bruit de voisinage changent parfois du tout au tout entre 10h et 19h.",
    ],
    authorId: "a2",
    publishedAt: "2026-05-05",
    category: "Conseils",
  },
];

export function getArticleBySlug(slug: string) {
  return articles.find((a) => a.slug === slug);
}

export function getAgentById(id: string) {
  return agents.find((a) => a.id === id);
}

export function getPropertyById(id: string) {
  return properties.find((p) => p.id === id);
}

export function formatPrice(price: number, kind: Property["kind"]) {
  const formatted = new Intl.NumberFormat("fr-FR").format(price);
  return kind === "location" ? `${formatted} € / mois` : `${formatted} €`;
}

export const statusLabels: Record<Property["status"], string> = {
  disponible: "Disponible",
  sous_offre: "Sous offre",
  vendu: "Vendu",
  loue: "Loué",
};

export const kindLabels: Record<Property["kind"], string> = {
  vente: "Vente",
  location: "Location",
  neuf: "Programme neuf",
};
