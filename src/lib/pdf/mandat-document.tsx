import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Property, User } from "@prisma/client";
import { formatPrice, kindLabels } from "@/lib/format";

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#1c2321",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    borderBottom: "1pt solid #d8d3c7",
    paddingBottom: 16,
  },
  agencyName: { fontSize: 18, fontFamily: "Helvetica-Bold" },
  agencyMeta: { fontSize: 9, color: "#555", marginTop: 4 },
  docTitle: { fontSize: 14, fontFamily: "Helvetica-Bold", textAlign: "right" },
  docRef: { fontSize: 9, color: "#555", textAlign: "right", marginTop: 4 },
  section: { marginBottom: 18 },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    color: "#2f4a3e",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  row: { flexDirection: "row", marginBottom: 3 },
  label: { width: 140, color: "#555" },
  value: { flex: 1, fontFamily: "Helvetica-Bold" },
  paragraph: { marginBottom: 8, lineHeight: 1.5 },
  signatures: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 48,
  },
  signatureBox: { width: "45%" },
  signatureLabel: { fontSize: 9, color: "#555", marginBottom: 40 },
  signatureLine: { borderTop: "1pt solid #1c2321", paddingTop: 4, fontSize: 9 },
  footer: {
    position: "absolute",
    bottom: 32,
    left: 48,
    right: 48,
    fontSize: 8,
    color: "#888",
    textAlign: "center",
  },
});

export function MandatDocument({
  property,
  agent,
}: {
  property: Property;
  agent: User;
}) {
  const mandatType = property.kind === "LOCATION" ? "de location" : "de vente";
  const today = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.agencyName}>Maison & Fils</Text>
            <Text style={styles.agencyMeta}>Cité des Annassers, 16035 Alger</Text>
            <Text style={styles.agencyMeta}>021 60 00 00 — contact@maisonetfils.fr</Text>
          </View>
          <View>
            <Text style={styles.docTitle}>MANDAT {mandatType.toUpperCase()}</Text>
            <Text style={styles.docRef}>Réf. bien {property.reference}</Text>
            <Text style={styles.docRef}>Établi le {today}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Le mandant (propriétaire)</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nom</Text>
            <Text style={styles.value}>{property.ownerName || "________________________"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Téléphone</Text>
            <Text style={styles.value}>{property.ownerPhone || "________________________"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{property.ownerEmail || "________________________"}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Le mandataire (agence)</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Agent en charge</Text>
            <Text style={styles.value}>{agent.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Téléphone</Text>
            <Text style={styles.value}>{agent.phone || "—"}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Le bien concerné</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Désignation</Text>
            <Text style={styles.value}>{property.title}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Adresse</Text>
            <Text style={styles.value}>{property.city} ({property.postalCode})</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Type</Text>
            <Text style={styles.value}>{kindLabels[property.kind]}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Surface</Text>
            <Text style={styles.value}>{property.surface} m²</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Prix mandaté</Text>
            <Text style={styles.value}>{formatPrice(property.price, property.kind)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Objet du mandat</Text>
          <Text style={styles.paragraph}>
            Le mandant confie à Maison & Fils, qui accepte, un mandat {mandatType}{" "}
            portant sur le bien désigné ci-dessus, aux conditions et au prix
            indiqués. Ce mandat est consenti pour une durée de trois (3) mois
            à compter de sa signature, renouvelable par tacite reconduction
            sauf dénonciation par l&apos;une des parties.
          </Text>
          <Text style={styles.paragraph}>
            L&apos;agence s&apos;engage à mettre en œuvre les moyens
            commerciaux habituels (publication en ligne, mise en relation
            avec des acquéreurs ou locataires potentiels, organisation de
            visites) pour mener à bien la transaction.
          </Text>
        </View>

        <View style={styles.signatures}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Signature du mandant</Text>
            <Text style={styles.signatureLine}>Lu et approuvé</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Signature de l&apos;agence</Text>
            <Text style={styles.signatureLine}>{agent.name}</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Document généré automatiquement — à faire relire par un
          professionnel du droit avant signature.
        </Text>
      </Page>
    </Document>
  );
}
