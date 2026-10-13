import Link from "next/link";
import { getAllProperties } from "@/lib/data/properties";
import { Button } from "@/components/ui/button";
import { PropertiesTable } from "@/components/admin/properties-table";

export default async function AdminPropertiesPage() {
  const properties = await getAllProperties();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink">Biens</h1>
          <p className="mt-1 text-sm text-ink-60">
            {properties.length} biens en portefeuille.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/biens/nouveau">Ajouter un bien</Link>
        </Button>
      </div>

      <div className="mt-6">
        <PropertiesTable initial={properties} />
      </div>
    </div>
  );
}
