import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { roleLabels } from "@/lib/format";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  // middleware already redirects unauthenticated users, session is defined here
  const user = session!.user;

  return (
    <div className="flex min-h-screen bg-stone-100">
      <AdminSidebar
        userName={user.name ?? ""}
        userRole={roleLabels[user.role] ?? user.role}
        isAdmin={user.role === "ADMIN"}
      />
      <div className="flex-1 overflow-x-hidden">{children}</div>
    </div>
  );
}
