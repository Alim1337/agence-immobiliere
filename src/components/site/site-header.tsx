"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "./favorites-context";

const nav = [
  { href: "/biens", label: "Nos biens" },
  { href: "/neuf", label: "Programmes neufs" },
  { href: "/estimation", label: "Estimer mon bien" },
  { href: "/actualites", label: "Actualités" },
  { href: "/agence", label: "L'agence" },
];

export function SiteHeader({
  agencyName,
  logoUrl,
}: {
  agencyName: string;
  logoUrl?: string | null;
}) {
  const { favorites } = useFavorites();

  return (
    <header className="border-b border-stone-line bg-stone/95 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl tracking-tight text-ink"
        >
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={agencyName} className="h-9 w-auto" />
          ) : (
            agencyName
          )}
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-ink-60 transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/favoris"
            className="relative flex h-10 w-10 items-center justify-center rounded-sm text-ink-60 transition-colors hover:bg-stone-100 hover:text-ink"
            aria-label="Voir mes favoris"
          >
            <Heart className="h-5 w-5" strokeWidth={1.5} />
            {favorites.length > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brass px-1 font-mono text-[10px] text-stone">
                {favorites.length}
              </span>
            )}
          </Link>
          <Button variant="outline" size="sm" asChild>
            <Link href="/contact">Nous contacter</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
