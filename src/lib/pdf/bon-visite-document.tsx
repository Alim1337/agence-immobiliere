import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Appointment, Lead, Property, User } from "@prisma/client";
import { formatPrice } from "@/lib/format";

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

export function BonDeVisiteDocument({
  appointment,
  lead,
  property,
  agent,
}: {
  appointment: Appointment;
  lead: Lead;
  property: Property;
  agent: User;
}) {
  const dateStr = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(appointment.date);

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
            <Text style={styles.docTitle}>BON DE VISITE</Text>
            <Text style={styles.docRef}>Réf. bien {property.reference}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visiteur</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nom</Text>
            <Text style={styles.value}>{lead.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Téléphone</Text>
            <Text style={styles.value}>{lead.phone || "—"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{lead.email || "—"}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accompagné par</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Agent</Text>
            <Text style={styles.value}>{agent.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date de visite</Text>
            <Text style={styles.value}>{dateStr}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bien visité</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Désignation</Text>
            <Text style={styles.value}>{property.title}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Adresse</Text>
            <Text style={styles.value}>{property.city} ({property.postalCode})</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Prix</Text>
            <Text style={styles.value}>{formatPrice(property.price, property.kind)}</Text>
          </View>
          {appointment.notes && (
            <View style={styles.row}>
              <Text style={styles.label}>Notes</Text>
              <Text style={styles.value}>{appointment.notes}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.paragraph}>
            Je soussigné(e) {lead.name}, reconnais avoir visité ce jour le
            bien désigné ci-dessus, présenté par Maison & Fils. Cette visite
            a été organisée par l&apos;intermédiaire exclusif de l&apos;agence,
            qui reste seule habilitée à percevoir une commission en cas de
            transaction sur ce bien, y compris si celle-ci intervient
            directement avec le propriétaire ou par l&apos;intermédiaire d&apos;un
            tiers, dans les douze mois suivant cette visite.
          </Text>
        </View>

        <View style={styles.signatures}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Signature du visiteur</Text>
            <Text style={styles.signatureLine}>Lu et approuvé</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Signature de l&apos;agent</Text>
            <Text style={styles.signatureLine}>{agent.name}</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Document généré automatiquement — à faire relire par un
          professionnel du droit avant usage.
        </Text>
      </Page>
    </Document>
  );
}
