import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({ success: true, quote: updatedQuote });
  } catch (error) {
    console.error("Error updating quote:", error);
    return NextResponse.json(
      { error: "Error al actualizar la cotización." },
      { status: 500 }
    );
  }
}
