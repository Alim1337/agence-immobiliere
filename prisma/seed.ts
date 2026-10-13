import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("demo1234", 10);

  const claire = await prisma.user.upsert({
    where: { email: "claire.vasseur@maisonetfils.fr" },
    update: {},
    create: {
      name: "Claire Vasseur",
      email: "claire.vasseur@maisonetfils.fr",
      phone: "021 60 12 04",
      role: "ADMIN",
      passwordHash,
    },
  });

  const nadir = await prisma.user.upsert({
    where: { email: "nadir.belkacem@maisonetfils.fr" },
    update: {},
    create: {
      name: "Nadir Belkacem",
      email: "nadir.belkacem@maisonetfils.fr",
      phone: "021 60 12 05",
      role: "AGENT",
      passwordHash,
    },
  });

  const emilie = await prisma.user.upsert({
    where: { email: "emilie.roussel@maisonetfils.fr" },
    update: {},
    create: {
      name: "Émilie Roussel",
      email: "emilie.roussel@maisonetfils.fr",
      phone: "021 60 12 06",
      role: "AGENT",
      passwordHash,
    },
  });

  await prisma.user.upsert({
    where: { email: "yanis.cherfi@maisonetfils.fr" },
    update: {},
    create: {
      name: "Yanis Cherfi",
      email: "yanis.cherfi@maisonetfils.fr",
      phone: "021 60 12 07",
      role: "ASSISTANT",
      passwordHash,
    },
  });

  const p1 = await prisma.property.upsert({
    where: { reference: "4521" },
    update: { latitude: 36.742, longitude: 3.0339 },
    create: {
      reference: "4521",
      title: "Appartement traversant avec vue dégagée",
      kind: "VENTE",
      category: "APPARTEMENT",
      status: "DISPONIBLE",
      price: 25000000,
      city: "Alger (Hydra)",
      postalCode: "16035",
      latitude: 36.742,
      longitude: 3.0339,
      surface: 78,
      rooms: 4,
      bedrooms: 3,
      description:
        "Au 5e étage avec ascenseur, cet appartement traversant baigne dans la lumière du matin au soir. Double séjour, cuisine séparée équipée, trois chambres et un cellier. Cave et parking en sous-sol inclus.",
      published: true,
      agentId: nadir.id,
    },
  });

  const p2 = await prisma.property.upsert({
    where: { reference: "4498" },
    update: { latitude: 35.6244, longitude: -0.6431 },
    create: {
      reference: "4498",
      title: "Villa avec jardin clos",
      kind: "VENTE",
      category: "MAISON",
      status: "DISPONIBLE",
      price: 32000000,
      city: "Oran (Es Sénia)",
      postalCode: "31025",
      latitude: 35.6244,
      longitude: -0.6431,
      surface: 112,
      rooms: 5,
      bedrooms: 4,
      description:
        "Villa rénovée avec goût, grand séjour lumineux et cheminée. Jardin clos de 300 m² exposé sud, dépendance aménageable en atelier ou bureau. Quartier calme et recherché.",
      published: true,
      agentId: emilie.id,
    },
  });

  const p3 = await prisma.property.upsert({
    where: { reference: "4534" },
    update: { latitude: 36.7762, longitude: 3.0586 },
    create: {
      reference: "4534",
      title: "Studio lumineux proche centre-ville",
      kind: "LOCATION",
      category: "APPARTEMENT",
      status: "DISPONIBLE",
      price: 45000,
      city: "Alger Centre",
      postalCode: "16000",
      latitude: 36.7762,
      longitude: 3.0586,
      surface: 24,
      rooms: 1,
      bedrooms: 0,
      description:
        "Studio refait à neuf à deux minutes du centre-ville. Kitchenette équipée, salle d'eau moderne, rangements optimisés. Idéal premier logement ou investissement locatif.",
      published: true,
      agentId: nadir.id,
    },
  });

  await prisma.property.upsert({
    where: { reference: "4560" },
    update: { latitude: 36.365, longitude: 6.6147 },
    create: {
      reference: "4560",
      title: "Programme neuf — Les Terrasses du Parc",
      kind: "NEUF",
      category: "APPARTEMENT",
      status: "DISPONIBLE",
      price: 14000000,
      city: "Constantine",
      postalCode: "25000",
      latitude: 36.365,
      longitude: 6.6147,
      surface: 62,
      rooms: 3,
      bedrooms: 2,
      description:
        "Livraison T4 2027. Résidence à taille humaine, prestations soignées, larges balcons filants. Derniers lots disponibles du F2 au F4.",
      published: true,
      agentId: claire.id,
    },
  });

  const p5 = await prisma.property.upsert({
    where: { reference: "4502" },
    update: { latitude: 36.728, longitude: 3.045 },
    create: {
      reference: "4502",
      title: "Duplex avec terrasse",
      kind: "VENTE",
      category: "APPARTEMENT",
      status: "SOUS_OFFRE",
      price: 48000000,
      city: "Alger (Bir Mourad Raïs)",
      postalCode: "16015",
      latitude: 36.728,
      longitude: 3.045,
      surface: 95,
      rooms: 4,
      bedrooms: 3,
      description:
        "Duplex au calme dans une résidence récente, terrasse de 18 m² exposée ouest, parking double en sous-sol.",
      published: true,
      agentId: emilie.id,
    },
  });

  await prisma.property.upsert({
    where: { reference: "4511" },
    update: { latitude: 35.6969, longitude: -0.6331 },
    create: {
      reference: "4511",
      title: "Local commercial avec vitrine",
      kind: "LOCATION",
      category: "LOCAL_COMMERCIAL",
      status: "DISPONIBLE",
      price: 180000,
      city: "Oran",
      postalCode: "31000",
      latitude: 35.6969,
      longitude: -0.6331,
      surface: 48,
      rooms: 2,
      bedrooms: 0,
      description:
        "Emplacement passant, vitrine de 6 mètres linéaires, arrière-boutique et point d'eau. Idéal commerce de bouche ou concept-store.",
      published: true,
      agentId: claire.id,
    },
  });

  // Leads: two unassigned (queue), some assigned across the pipeline
  const l1 = await prisma.lead.create({
    data: {
      name: "Sophie Marchand",
      email: "sophie.marchand@example.com",
      phone: "0661 23 45 67",
      source: "SITE_WEB",
      stage: "NOUVEAU",
      budgetMin: 20000000,
      budgetMax: 28000000,
      city: "Alger (Hydra)",
      propertyId: p1.id,
    },
  });

  await prisma.lead.create({
    data: {
      name: "Karim Idrissi",
      email: "karim.idrissi@example.com",
      phone: "0771 98 76 54",
      source: "PORTAIL_ANNONCE",
      stage: "NOUVEAU",
      budgetMin: 15000000,
      budgetMax: 20000000,
      city: "Oran",
    },
  });

  const l3 = await prisma.lead.create({
    data: {
      name: "Julie Fontaine",
      email: "julie.fontaine@example.com",
      phone: "0551 11 22 33",
      source: "TELEPHONE",
      stage: "CONTACTE",
      budgetMin: 28000000,
      budgetMax: 35000000,
      city: "Oran (Es Sénia)",
      assignedToId: emilie.id,
      propertyId: p2.id,
    },
  });

  await prisma.lead.create({
    data: {
      name: "Thomas Le Gall",
      email: "thomas.legall@example.com",
      phone: "0661 55 44 33",
      source: "SITE_WEB",
      stage: "QUALIFIE",
      budgetMin: 40000,
      budgetMax: 50000,
      city: "Alger Centre",
      assignedToId: nadir.id,
      propertyId: p3.id,
    },
  });

  await prisma.interaction.create({
    data: {
      leadId: l3.id,
      userId: emilie.id,
      type: "APPEL",
      content:
        "Premier contact, très intéressée par le jardin. Rappeler après sa visite chez le notaire.",
    },
  });

  await prisma.appointment.create({
    data: {
      leadId: l3.id,
      propertyId: p2.id,
      userId: emilie.id,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000), // demain
      notes: "Deuxième visite, avec son conjoint.",
    },
  });

  await prisma.appointment.create({
    data: {
      leadId: l1.id,
      propertyId: p1.id,
      userId: nadir.id,
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      notes: "Première visite.",
    },
  });

  await prisma.article.upsert({
    where: { slug: "prix-immobilier-alger-2026" },
    update: {},
    create: {
      slug: "prix-immobilier-alger-2026",
      title: "Prix de l'immobilier à Alger : ce qui change en 2026",
      excerpt:
        "Le marché algérois se stabilise après deux ans de hausse continue. Voici les tendances par commune.",
      content: [
        "Après une hausse marquée en 2024 et 2025, les prix se stabilisent dans la plupart des communes d'Alger. Hydra et Bir Mourad Raïs restent les plus recherchées, tandis qu'Alger Centre attire une clientèle plus jeune en quête de proximité avec le travail.",
        "Les biens récents ou rénovés se négocient désormais nettement plus vite que les biens nécessitant des travaux importants, qui subissent une décote pouvant atteindre 10 à 15 %.",
        "Pour les vendeurs, le message est clair : un bien bien positionné en prix dès la mise en vente se vend en moyenne deux fois plus vite qu'un bien surestimé puis rabaissé.",
      ].join("\n\n"),
      category: "Marché",
      authorId: claire.id,
      publishedAt: new Date("2026-06-12"),
    },
  });

  await prisma.article.upsert({
    where: { slug: "diagnostic-technique-avant-vente" },
    update: {},
    create: {
      slug: "diagnostic-technique-avant-vente",
      title: "Diagnostic technique : ce qu'il faut vérifier avant de vendre",
      excerpt:
        "Étanchéité, installation électrique, charpente : la check-list technique qui rassure un acheteur.",
      content: [
        "Avant de mettre un bien en vente, un état des lieux technique honnête évite bien des négociations tendues en cours de transaction. Étanchéité de la toiture, état de l'installation électrique, présence d'humidité : ce sont les trois points que nos agents vérifient en priorité avec les propriétaires.",
        "Pour les biens anciens, un simple rafraîchissement (peinture, joints, réparations mineures) peut significativement accélérer la vente, souvent pour un coût bien inférieur à la décote qu'un acheteur négocierait sinon.",
        "Notre conseil : fais réaliser cet état des lieux avant la première visite plutôt qu'après une offre, pour éviter les mauvaises surprises en cours de négociation.",
      ].join("\n\n"),
      category: "Conseils",
      authorId: emilie.id,
      publishedAt: new Date("2026-05-28"),
    },
  });

  await prisma.article.upsert({
    where: { slug: "premiere-visite-conseils-acheteurs" },
    update: {},
    create: {
      slug: "premiere-visite-conseils-acheteurs",
      title: "Première visite : les 7 points à vérifier absolument",
      excerpt:
        "Nos agents partagent leur check-list pour ne rien laisser passer lors d'une visite.",
      content: [
        "Une visite dure rarement plus de 20 minutes : autant savoir où regarder. Humidité, exposition, bruit, charges de copropriété, travaux à prévoir sont les points que nos agents vérifient systématiquement avec leurs clients.",
        "N'hésitez pas à demander l'historique des charges et des travaux réalisés dans l'immeuble : cela révèle souvent des travaux importants à venir, invisibles lors d'une simple visite.",
        "Enfin, revenez si possible à un autre moment de la journée : la luminosité et le bruit de voisinage changent parfois du tout au tout entre le matin et le soir.",
      ].join("\n\n"),
      category: "Conseils",
      authorId: nadir.id,
      publishedAt: new Date("2026-05-05"),
    },
  });

  console.log("Seed terminé:", { claire: claire.email, leads: [l1.id, l3.id] });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
