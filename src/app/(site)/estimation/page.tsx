import { PropertyPhoto } from "@/components/site/property-photo";
import { EstimationForm } from "./estimation-form";

const steps = [
  {
    n: "01",
    title: "Vous décrivez votre bien",
    text: "Adresse, type, surface : deux minutes suffisent.",
  },
  {
    n: "02",
    title: "Un agent analyse le secteur",
    text: "Comparaison avec les ventes récentes de votre quartier.",
  },
  {
    n: "03",
    title: "Rendez-vous sur place",
    text: "Visite gratuite et estimation détaillée, sans engagement.",
  },
];

export default function EstimationPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="grid gap-14 md:grid-cols-2">
        {/* Left: pitch + process */}
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-brass-dark">
            Estimation gratuite
          </span>
          <h1 className="mt-3 font-display text-3xl leading-tight text-ink md:text-4xl">
            Quelle est la vraie valeur de votre bien aujourd&apos;hui ?
          </h1>
          <p className="mt-4 max-w-md text-ink-60">
            Les prix évoluent vite. Nos agents comparent votre bien aux
            transactions réelles du quartier pour vous donner un chiffre
            fiable, pas une fourchette au hasard.
          </p>

          <ol className="mt-10 space-y-6">
            {steps.map((step) => (
              <li key={step.n} className="flex gap-4">
                <span className="font-mono text-sm text-brass-dark">
                  {step.n}
                </span>
                <div>
                  <p className="font-medium text-ink">{step.title}</p>
                  <p className="mt-0.5 text-sm text-ink-60">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex items-center gap-3 rounded-sm border border-stone-line bg-white p-4">
            <PropertyPhoto className="h-12 w-12 rounded-full shrink-0" />
            <p className="text-sm text-ink-60">
              <span className="font-medium text-ink">Claire Vasseur</span> —
              répond personnellement aux demandes d&apos;estimation sous 24h.
            </p>
          </div>
        </div>

        {/* Right: form */}
        <EstimationForm />
      </div>
    </div>
  );
}
