import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { GeneralContactForm } from "./contact-form";
import { getAgencySettings } from "@/lib/data/settings";

export default async function ContactPage() {
  const settings = await getAgencySettings();

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <span className="font-mono text-xs uppercase tracking-widest text-brass-dark">
        Contact
      </span>
      <h1 className="mt-2 font-display text-3xl text-ink">
        Une question ? Un projet ? Écrivez-nous
      </h1>
      <p className="mt-3 max-w-xl text-ink-60">
        Que vous cherchiez un bien, souhaitiez vendre, ou ayez simplement une
        question, un membre de l&apos;équipe vous répond sous 24h ouvrées.
      </p>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <InfoRow
            icon={<MapPin className="h-5 w-5" strokeWidth={1.5} />}
            label="Adresse"
            value={`${settings.addressLine}, ${settings.postalCode} ${settings.city}`}
          />
          <InfoRow
            icon={<Phone className="h-5 w-5" strokeWidth={1.5} />}
            label="Téléphone"
            value={settings.phone}
          />
          <InfoRow
            icon={<Mail className="h-5 w-5" strokeWidth={1.5} />}
            label="Email"
            value={settings.email}
          />
          <InfoRow
            icon={<Clock className="h-5 w-5" strokeWidth={1.5} />}
            label="Horaires"
            value={"Lun. – Ven. : 9h – 19h\nSamedi : 10h – 17h"}
          />
        </div>

        <GeneralContactForm />
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 text-pine">{icon}</span>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-ink-60">
          {label}
        </p>
        <p className="mt-0.5 whitespace-pre-line text-sm text-ink">{value}</p>
      </div>
    </div>
  );
}
