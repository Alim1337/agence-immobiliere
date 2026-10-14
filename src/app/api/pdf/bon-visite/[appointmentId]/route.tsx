import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BonDeVisiteDocument } from "@/lib/pdf/bon-visite-document";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ appointmentId: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { appointmentId } = await params;
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { lead: true, property: true, user: true },
  });

  if (!appointment) {
    return NextResponse.json({ error: "Rendez-vous introuvable" }, { status: 404 });
  }

  const buffer = await renderToBuffer(
    <BonDeVisiteDocument
      appointment={appointment}
      lead={appointment.lead}
      property={appointment.property}
      agent={appointment.user}
    />
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="bon-de-visite-${appointment.id}.pdf"`,
    },
  });
}
