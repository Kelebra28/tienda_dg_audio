import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, customerEmail, customerPhone, message, items } = body;

    if (!customerName || !customerEmail || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Nombre, email y al menos un producto son requeridos." },
        { status: 400 }
      );
    }

    // Create the quote and its items in a transaction
    const quote = await prisma.quote.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        message,
        status: "PENDING",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, quoteId: quote.id });
  } catch (error) {
    console.error("Error creating quote:", error);
    return NextResponse.json(
      { error: "Error al guardar la cotización." },
      { status: 500 }
    );
  }
}
