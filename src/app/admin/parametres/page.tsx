import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getAgencySettings } from "@/lib/data/settings";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function AdminSettingsPage() {
  const session = await auth();
  if (session!.user.role !== "ADMIN") redirect("/admin");

  const settings = await getAgencySettings();

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl text-ink">Paramètres de l&apos;agence</h1>
      <p className="mt-1 text-sm text-ink-60">
        Ces informations sont affichées sur tout le site public (header,
        footer, page contact, bouton WhatsApp).
      </p>

      <SettingsForm settings={settings} />
    </div>
  );
}
