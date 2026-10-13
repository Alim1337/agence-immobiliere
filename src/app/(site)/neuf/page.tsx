import Link from "next/link";
import { PropertyImage } from "@/components/site/property-image";
import { Badge } from "@/components/ui/badge";
import { getNeufPrograms } from "@/lib/data/properties";
import { formatPrice } from "@/lib/format";

export default async function NeufPage() {
  const neufLots = await getNeufPrograms();

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <span className="font-mono text-xs uppercase tracking-widest text-brass-dark">
        Programmes neufs
      </span>
      <h1 className="mt-2 font-display text-3xl text-ink">
        Construire aujourd&apos;hui, habiter demain
      </h1>
      <p className="mt-3 max-w-xl text-ink-60">
        Résidences neuves sélectionnées par l&apos;agence : normes récentes,
        garanties constructeur, et un lot qui vous correspond selon votre
        budget et le calendrier de livraison.
      </p>

      <div className="mt-10 space-y-10">
        {neufLots.map((program) => (
          <article
            key={program.id}
            className="grid gap-0 overflow-hidden rounded-sm border border-stone-line bg-white md:grid-cols-2"
          >
            <PropertyImage images={program.images} className="h-64 w-full md:h-full" />
            <div className="p-7">
              <div className="flex items-center gap-2">
                <Badge variant="brass">Livraison T4 2027</Badge>
                <Badge variant="pine">{program.city}</Badge>
              </div>
              <h2 className="mt-3 font-display text-2xl text-ink">
                {program.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-60">
                {program.description}
              </p>

              <div className="mt-6 grid grid-cols-3 divide-x divide-stone-line border-y border-stone-line py-4 text-center">
                <div>
                  <p className="font-mono text-lg text-ink">
                    {program.surface} m²
                  </p>
                  <p className="text-xs text-ink-60">à partir de</p>
                </div>
                <div>
                  <p className="font-mono text-lg text-ink">
                    {formatPrice(program.price, program.kind)}
                  </p>
                  <p className="text-xs text-ink-60">prix d&apos;appel</p>
                </div>
                <div>
                  <p className="font-mono text-lg text-ink">T2 – T4</p>
                  <p className="text-xs text-ink-60">lots restants</p>
                </div>
              </div>

              <Link
                href={`/biens/${program.id}`}
                className="mt-6 inline-flex h-11 items-center rounded-sm bg-pine px-6 text-sm font-medium text-stone hover:bg-pine-dark"
              >
                Voir les lots disponibles
              </Link>
            </div>
          </article>
        ))}

        {neufLots.length === 0 && (
          <div className="rounded-sm border border-dashed border-stone-line p-12 text-center">
            <p className="font-display text-lg text-ink">
              Aucun programme neuf en cours actuellement
            </p>
            <p className="mt-2 text-sm text-ink-60">
              Laissez vos coordonnées et soyez averti dès l&apos;ouverture
              d&apos;un nouveau programme.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
