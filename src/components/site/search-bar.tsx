import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function SearchBar({ className }: { className?: string }) {
  return (
    <form
      action="/biens"
      className={
        "grid gap-3 rounded-sm border border-stone-line bg-white p-4 shadow-[0_12px_32px_-16px_rgba(28,35,33,0.3)] md:grid-cols-[1.4fr_1fr_1fr_auto] " +
        (className ?? "")
      }
    >
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-60" />
        <Input
          name="q"
          placeholder="Ville, quartier, référence..."
          className="pl-9"
        />
      </div>
      <Select name="kind" defaultValue="">
        <option value="">Achat ou location</option>
        <option value="VENTE">Acheter</option>
        <option value="LOCATION">Louer</option>
        <option value="NEUF">Programme neuf</option>
      </Select>
      <Select name="category" defaultValue="">
        <option value="">Type de bien</option>
        <option value="APPARTEMENT">Appartement</option>
        <option value="MAISON">Maison</option>
        <option value="TERRAIN">Terrain</option>
        <option value="LOCAL_COMMERCIAL">Local commercial</option>
      </Select>
      <Button type="submit" size="default" className="w-full md:w-auto">
        Rechercher
      </Button>
    </form>
  );
}
