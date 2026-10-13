import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { FavoritesProvider } from "@/components/site/favorites-context";
import { getAgencySettings } from "@/lib/data/settings";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getAgencySettings();

  return (
    <FavoritesProvider>
      <SiteHeader agencyName={settings.name} logoUrl={settings.logoUrl} />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} />
    </FavoritesProvider>
  );
}
