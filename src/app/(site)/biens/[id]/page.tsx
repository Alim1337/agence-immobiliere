import { notFound } from "next/navigation";
import { BedDouble, Ruler, Home as HomeIcon, Zap } from "lucide-react";
import { PropertyPhoto } from "@/components/site/property-photo";
import { PropertyImage } from "@/components/site/property-image";
import { ContactForm } from "@/components/site/contact-form";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { FavoriteButton } from "@/components/site/favorite-button";
import { PropertyMap } from "@/components/site/property-map";
import { getPublicPropertyById } from "@/lib/data/properties";
import { getAgencySettings } from "@/lib/data/settings";
import { formatPrice, kindLabels, statusLabels } from "@/lib/format";

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getPublicPropertyById(id);
  if (!property) notFound();
  const settings = await getAgencySettings();

  const agent = property.agent;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Gallery */}
      <div className="relative grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-sm">
        <PropertyImage
          images={property.images}
          index={0}
          alt={property.title}
          className="col-span-2 row-span-2 h-full min-h-[320px] w-full"
        />
        <PropertyImage images={property.images} index={1} className="h-full min-h-[156px] w-full" />
        <PropertyImage images={property.images} index={2} className="h-full min-h-[156px] w-full" />
        <PropertyImage images={property.images} index={3} className="h-full min-h-[156px] w-full" />
        <PropertyImage images={property.images} index={4} className="h-full min-h-[156px] w-full" />
        <div className="dossier-tab absolute left-0 top-4 rounded-r-sm px-3 py-1 text-xs">
          Réf. {property.reference}
        </div>
        <FavoriteButton propertyId={property.id} className="absolute right-4 top-4" />
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_340px]">
        {/* Main content */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wide text-brass-dark">
              {kindLabels[property.kind]}
            </span>
            <span className="text-ink-60">·</span>
            <span className="text-sm text-ink-60">
              {statusLabels[property.status]}
            </span>
          </div>
          <h1 className="mt-2 font-display text-3xl text-ink">
            {property.title}
          </h1>
          <p className="mt-1 text-ink-60">
            {property.city} ({property.postalCode})
          </p>

          <div className="mt-6 flex flex-wrap gap-6 border-y border-stone-line py-5">
            <Spec icon={<Ruler className="h-5 w-5" strokeWidth={1.5} />} label={`${property.surface} m²`} />
            <Spec icon={<HomeIcon className="h-5 w-5" strokeWidth={1.5} />} label={`${property.rooms} pièces`} />
            {property.bedrooms > 0 && (
              <Spec icon={<BedDouble className="h-5 w-5" strokeWidth={1.5} />} label={`${property.bedrooms} chambres`} />
            )}
            {property.dpe && (
              <Spec icon={<Zap className="h-5 w-5" strokeWidth={1.5} />} label={`DPE ${property.dpe}`} />
            )}
          </div>

          <div className="mt-6">
            <h2 className="font-display text-xl text-ink">Description</h2>
            <p className="mt-3 leading-relaxed text-ink-60">
              {property.description}
            </p>
          </div>

          {property.latitude != null && property.longitude != null && (
            <div className="mt-6">
              <h2 className="font-display text-xl text-ink">Localisation</h2>
              <PropertyMap
                className="mt-3 h-64 w-full rounded-sm border border-stone-line"
                zoom={14}
                markers={[
                  {
                    id: property.id,
                    latitude: property.latitude,
                    longitude: property.longitude,
                    title: property.title,
                    priceLabel: formatPrice(property.price, property.kind),
                    href: `/biens/${property.id}`,
                  },
                ]}
              />
            </div>
          )}
        </div>

        {/* Sidebar: price + contact */}
        <aside className="h-fit space-y-6">
          <div className="rounded-sm border border-stone-line bg-white p-6">
            <p className="font-mono text-2xl text-ink">
              {formatPrice(property.price, property.kind)}
            </p>
            {agent && (
              <div className="mt-4 flex items-center gap-3 border-t border-stone-line pt-4">
                <PropertyPhoto className="h-11 w-11 rounded-full" />
                <div>
                  <p className="text-sm font-medium text-ink">
                    {agent.name}
                  </p>
                  <p className="text-xs text-ink-60">{agent.phone}</p>
                </div>
              </div>
            )}
            <WhatsAppButton
              whatsappNumber={settings.whatsapp}
              message={`Bonjour, je suis intéressé(e) par le bien réf. ${property.reference} (${property.title}).`}
              className="mt-4 w-full"
            />
          </div>

          <ContactForm propertyId={property.id} reference={property.reference} />
        </aside>
      </div>
    </div>
  );
}

function Spec({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-ink">
      <span className="text-pine">{icon}</span>
      {label}
    </div>
  );
}
