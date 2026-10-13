import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileDown } from "lucide-react";
import { getPropertyByIdAdmin } from "@/lib/data/properties";
import { PropertyEditForm } from "@/components/admin/property-edit-form";
import { PropertyImagesManager } from "@/components/admin/property-images-manager";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getPropertyByIdAdmin(id);
  if (!property) notFound();

  return (
    <div className="mx-auto max-w-2xl p-8">
      <Link
        href="/admin/biens"
        className="flex items-center gap-1.5 text-sm text-ink-60 hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Biens
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink">
            Modifier le bien
          </h1>
          <p className="mt-1 text-sm text-ink-60">Réf. {property.reference}</p>
        </div>
        <a
          href={`/api/pdf/mandat/${property.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-sm border border-stone-line bg-white px-3.5 py-2 text-sm text-ink hover:bg-stone-100"
        >
          <FileDown className="h-4 w-4" />
          Télécharger le mandat
        </a>
      </div>

      <div className="mt-6 rounded-sm border border-stone-line bg-white p-6">
        <label className="text-xs font-medium uppercase tracking-wide text-ink-60">
          Photos
        </label>
        <div className="mt-2">
          <PropertyImagesManager
            propertyId={property.id}
            initialImages={property.images.map((img) => ({
              id: img.id,
              url: img.url,
            }))}
          />
        </div>
      </div>

      <div className="mt-6">
        <PropertyEditForm property={property} />
      </div>
    </div>
  );
}
