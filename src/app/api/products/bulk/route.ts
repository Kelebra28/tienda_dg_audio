import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const products = await req.json();

    if (!Array.isArray(products)) {
      return NextResponse.json({ error: "El formato de datos no es válido. Se esperaba un array." }, { status: 400 });
    }

    // Vaciar la tabla de productos
    await prisma.product.deleteMany({});

    // Insertar todos los productos en batch
    const result = await prisma.product.createMany({
      data: products
    });

    return NextResponse.json({ success: true, count: result.count }, { status: 201 });
  } catch (error: any) {
    console.error("Error en la subida masiva de productos:", error);
    return NextResponse.json({ error: error.message || "Error al procesar la subida masiva." }, { status: 500 });
  }
}
