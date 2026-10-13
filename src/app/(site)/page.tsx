import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SearchBar } from "@/components/site/search-bar";
import { PropertyCard } from "@/components/site/property-card";
import { PropertyPhoto } from "@/components/site/property-photo";
import { getFeaturedProperties } from "@/lib/data/properties";
import { getAllAgents } from "@/lib/data/leads";
import { getAgencySettings } from "@/lib/data/settings";
import { roleLabels } from "@/lib/format";

export default async function Home() {
  const [featured, agents, settings] = await Promise.all([
    getFeaturedProperties(4),
    getAllAgents(),
    getAgencySettings(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-grain border-b border-stone-line">
        <div className="mx-auto max-w-6xl px-6 pb-16 pt-16 md:pt-24">
          <span className="font-mono text-xs uppercase tracking-widest text-brass-dark">
            {settings.tagline}
          </span>
          <h1 className="mt-4 max-w-2xl font-display text-4xl leading-[1.1] text-ink md:text-5xl">
            Chaque bien a une histoire.
            <br />
            Nous vous aidons à écrire la vôtre.
          </h1>
          <p className="mt-5 max-w-xl text-base text-ink-60">
            Achat, vente, location : une équipe de trois agents qui connaît
            chaque rue, chaque copropriété, chaque dossier.
          </p>

          <SearchBar className="mt-10 max-w-3xl" />
        </div>
      </section>

      {/* Featured listings */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-ink-60">
              Sélection du moment
            </span>
            <h2 className="mt-2 font-display text-2xl text-ink">
              Biens à la une
            </h2>
          </div>
          <Link
            href="/biens"
            className="flex items-center gap-1 text-sm text-pine hover:text-pine-dark"
          >
            Tous les biens <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="mt-8 text-sm text-ink-60">
            Aucun bien publié pour le moment.
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* Estimation CTA */}
      <section className="border-y border-stone-line bg-pine">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl text-stone md:text-3xl">
              Vous pensez vendre ou louer ?
            </h2>
            <p className="mt-2 max-w-md text-sm text-stone/80">
              Estimation gratuite et sans engagement, réalisée par un agent
              qui connaît votre secteur.
            </p>
          </div>
          <Link
            href="/estimation"
            className="inline-flex h-12 items-center rounded-sm bg-brass px-7 text-sm font-medium text-stone hover:bg-brass-dark"
          >
            Estimer mon bien
          </Link>
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <span className="font-mono text-xs uppercase tracking-widest text-ink-60">
          L'équipe
        </span>
        <h2 className="mt-2 font-display text-2xl text-ink">
          Trois agents, un même quartier de prédilection
        </h2>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="rounded-sm border border-stone-line bg-white p-5"
            >
              <PropertyPhoto className="h-40 w-full rounded-sm" />
              <p className="mt-4 font-display text-lg text-ink">
                {agent.name}
              </p>
              <p className="text-sm text-ink-60">{roleLabels[agent.role]}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
