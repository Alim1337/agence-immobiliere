"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarDays,
  Newspaper,
  UserCog,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/actions/auth-logout";

const links = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/biens", label: "Biens", icon: Building2 },
  { href: "/admin/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/admin/articles", label: "Articles", icon: Newspaper },
];

const adminOnlyLinks = [
  { href: "/admin/agents", label: "Agents", icon: UserCog },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

export function AdminSidebar({
  userName,
  userRole,
  isAdmin,
}: {
  userName: string;
  userRole: string;
  isAdmin: boolean;
}) {
  const pathname = usePathname();
  const allLinks = isAdmin ? [...links, ...adminOnlyLinks] : links;

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-stone-line bg-white">
      <div className="border-b border-stone-line px-5 py-5">
        <Link href="/" className="font-display text-lg text-ink">
          Maison <span className="text-pine">&amp;</span> Fils
        </Link>
        <p className="mt-0.5 text-xs text-ink-60">Back-office</p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {allLinks.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2.5 rounded-sm px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-pine-tint text-pine-dark"
                  : "text-ink-60 hover:bg-stone-100 hover:text-ink"
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.5} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-stone-line p-4">
        <p className="text-sm font-medium text-ink">{userName}</p>
        <p className="text-xs uppercase tracking-wide text-ink-60">
          {userRole}
        </p>
        <form action={logoutAction}>
          <button
            type="submit"
            className="mt-3 flex items-center gap-2 text-xs text-ink-60 hover:text-alert"
          >
            <LogOut className="h-3.5 w-3.5" /> Se déconnecter
          </button>
        </form>
      </div>
    </aside>
  );
}
