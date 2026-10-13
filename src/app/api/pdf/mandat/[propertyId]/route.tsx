import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { auth } from "@/auth";
import { getPropertyByIdAdmin } from "@/lib/data/properties";
import { MandatDocument } from "@/lib/pdf/mandat-document";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { propertyId } = await params;
  const property = await getPropertyByIdAdmin(propertyId);
  if (!property) {
    return NextResponse.json({ error: "Bien introuvable" }, { status: 404 });
  }

  const buffer = await renderToBuffer(
    <MandatDocument property={property} agent={property.agent} />
  );

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="mandat-${property.reference}.pdf"`,
    },
  });
}
