import { PropertyPhoto } from "@/components/site/property-photo";
import { getAllAgents } from "@/lib/data/leads";
import { roleLabels } from "@/lib/format";

export default async function AgencePage() {
  const agents = await getAllAgents();

  return (
    <div>
      <section className="border-b border-stone-line bg-stone-100">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <span className="font-mono text-xs uppercase tracking-widest text-brass-dark">
            Depuis 1998
          </span>
          <h1 className="mt-3 max-w-2xl font-display text-3xl text-ink md:text-4xl">
            Une agence indépendante, trois agents, un même quartier
          </h1>
          <p className="mt-4 max-w-xl text-ink-60">
            Maison &amp; Fils accompagne les propriétaires et locataires
            algérois depuis plus de 25 ans. Pas de portefeuille anonyme :
            chaque dossier est suivi par la même personne, du premier appel à
            la signature.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-2xl text-ink">L&apos;équipe</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="rounded-sm border border-stone-line bg-white p-6"
            >
              <PropertyPhoto className="h-48 w-full rounded-sm" />
              <p className="mt-4 font-display text-lg text-ink">
                {agent.name}
              </p>
              <p className="text-sm text-ink-60">{roleLabels[agent.role]}</p>
              <div className="mt-3 space-y-1 border-t border-stone-line pt-3 text-sm text-ink-60">
                <p>{agent.phone}</p>
                <p>{agent.email}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-stone-line bg-pine-tint">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 sm:grid-cols-3">
          <Stat number="320+" label="Transactions accompagnées" />
          <Stat number="25 ans" label="D'implantation locale" />
          <Stat number="24h" label="Délai moyen de réponse" />
        </div>
      </section>
    </div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <p className="font-display text-3xl text-pine-dark">{number}</p>
      <p className="mt-1 text-sm text-ink-60">{label}</p>
    </div>
  );
}
