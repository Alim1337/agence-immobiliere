import { PropertyCard } from "@/components/site/property-card";
import { PropertyMap } from "@/components/site/property-map";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getPublicProperties } from "@/lib/data/properties";
import { formatPrice } from "@/lib/format";
import type { PropertyCategory, PropertyKind } from "@prisma/client";

export default async function BiensPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; kind?: string; category?: string }>;
}) {
  const params = await searchParams;

  const filtered = await getPublicProperties({
    q: params.q,
    kind: params.kind ? (params.kind as PropertyKind) : undefined,
    category: params.category ? (params.category as PropertyCategory) : undefined,
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <span className="font-mono text-xs uppercase tracking-widest text-ink-60">
        {filtered.length} bien{filtered.length > 1 ? "s" : ""}
      </span>
      <h1 className="mt-2 font-display text-3xl text-ink">
        Nos biens disponibles
      </h1>

      <div className="mt-8 grid gap-10 md:grid-cols-[240px_1fr]">
        {/* Filters sidebar */}
        <aside className="h-fit rounded-sm border border-stone-line bg-white p-5">
          <form className="space-y-5" action="/biens">
            <div>
              <label className="text-xs font-medium text-ink-60">
                Recherche
              </label>
              <Input
                name="q"
                defaultValue={params.q}
                placeholder="Ville, réf..."
                className="mt-1.5"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ink-60">
                Transaction
              </label>
              <Select name="kind" defaultValue={params.kind ?? ""} className="mt-1.5">
                <option value="">Toutes</option>
                <option value="VENTE">Achat</option>
                <option value="LOCATION">Location</option>
                <option value="NEUF">Programme neuf</option>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-ink-60">
                Type de bien
              </label>
              <Select
                name="category"
                defaultValue={params.category ?? ""}
                className="mt-1.5"
              >
                <option value="">Tous</option>
                <option value="APPARTEMENT">Appartement</option>
                <option value="MAISON">Maison</option>
                <option value="TERRAIN">Terrain</option>
                <option value="LOCAL_COMMERCIAL">Local commercial</option>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Filtrer
            </Button>
          </form>
        </aside>

        {/* Results */}
        <div>
          {filtered.length === 0 ? (
            <div className="rounded-sm border border-dashed border-stone-line p-12 text-center">
              <p className="font-display text-lg text-ink">
                Aucun bien ne correspond à cette recherche
              </p>
              <p className="mt-2 text-sm text-ink-60">
                Essayez d&apos;élargir vos critères, ou contactez un agent qui
                pourra vous alerter dès qu&apos;un bien correspondant arrive.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          {(() => {
            const withCoords = filtered.filter(
              (p) => p.latitude != null && p.longitude != null
            );
            if (withCoords.length === 0) return null;
            return (
              <PropertyMap
                className="mt-8 h-80 w-full rounded-sm border border-stone-line"
                markers={withCoords.map((p) => ({
                  id: p.id,
                  latitude: p.latitude!,
                  longitude: p.longitude!,
                  title: p.title,
                  priceLabel: formatPrice(p.price, p.kind),
                  href: `/biens/${p.id}`,
                }))}
              />
            );
          })()}
        </div>
      </div>
    </div>
  );
}
