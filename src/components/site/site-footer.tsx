import Link from "next/link";
import type { AgencySettings } from "@prisma/client";

export function SiteFooter({ settings }: { settings: AgencySettings }) {
  return (
    <footer className="border-t border-stone-line bg-stone-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <p className="font-display text-lg text-ink">{settings.name}</p>
          <p className="mt-3 text-sm text-ink-60">
            Agence immobilière indépendante à {settings.city}.
            <br />
            {settings.addressLine}, {settings.postalCode} {settings.city}
          </p>
        </div>
        <FooterColumn
          title="Biens"
          links={[
            { href: "/biens?kind=VENTE", label: "Achat" },
            { href: "/biens?kind=LOCATION", label: "Location" },
            { href: "/neuf", label: "Programmes neufs" },
            { href: "/estimation", label: "Estimation gratuite" },
          ]}
        />
        <FooterColumn
          title="Agence"
          links={[
            { href: "/agence", label: "Notre équipe" },
            { href: "/actualites", label: "Actualités" },
            { href: "/mentions-legales", label: "Mentions légales" },
          ]}
        />
        <div>
          <p className="text-sm font-medium text-ink">Nous contacter</p>
          <p className="mt-3 text-sm text-ink-60">
            {settings.phone}
            <br />
            {settings.email}
          </p>
        </div>
      </div>
      <div className="border-t border-stone-line px-6 py-5 text-center text-xs text-ink-60">
        © {new Date().getFullYear()} {settings.name} — Registre du
        commerce n° 16/00-0000000 A 24
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-sm font-medium text-ink">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-ink-60 transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
