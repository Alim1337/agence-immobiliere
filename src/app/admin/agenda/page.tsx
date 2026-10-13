import { auth } from "@/auth";
import { getAppointments } from "@/lib/data/appointments";
import { CalendarDays, FileDown } from "lucide-react";

export default async function AgendaPage() {
  const session = await auth();
  const user = session!.user;
  const isAdmin = user.role === "ADMIN";

  const visible = await getAppointments({ userId: user.id, isAdmin });

  const byDay = visible.reduce<Record<string, typeof visible>>((acc, a) => {
    const day = a.date.toISOString().slice(0, 10);
    acc[day] = acc[day] ? [...acc[day], a] : [a];
    return acc;
  }, {});

  const days = Object.keys(byDay).sort();

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl text-ink">Agenda</h1>
      <p className="mt-1 text-sm text-ink-60">
        {isAdmin
          ? "Rendez-vous de toute l'agence."
          : "Vos rendez-vous à venir."}
      </p>

      <div className="mt-6 space-y-6">
        {days.length === 0 && (
          <p className="text-sm text-ink-60">Aucun rendez-vous planifié.</p>
        )}
        {days.map((day) => (
          <div key={day}>
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-ink-60">
              <CalendarDays className="h-3.5 w-3.5" />
              {new Intl.DateTimeFormat("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              }).format(new Date(day))}
            </p>
            <div className="mt-2 space-y-2">
              {byDay[day].map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-4 rounded-sm border border-stone-line bg-white p-4"
                >
                  <p className="w-16 shrink-0 font-mono text-sm text-pine-dark">
                    {new Intl.DateTimeFormat("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(a.date)}
                  </p>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink">
                      {a.lead.name} — {a.property.title}
                    </p>
                    {a.notes && (
                      <p className="text-xs text-ink-60">{a.notes}</p>
                    )}
                  </div>
                  {isAdmin && (
                    <p className="text-xs text-ink-60">{a.user.name}</p>
                  )}
                  <a
                    href={`/api/pdf/bon-visite/${a.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-pine hover:text-pine-dark"
                  >
                    <FileDown className="h-3.5 w-3.5" />
                    Bon de visite
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
