import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const products = await req.json();

    if (!Array.isArray(products)) {
      return NextResponse.json({ error: "El formato de datos no es válido. Se esperaba un array." }, { status: 400 });
    }

    let successCount = 0;

    // Procesar cada producto: Upsert (Actualizar si existe, Crear si no)
    for (const product of products) {
      if (product.id) {
        // Intentar actualizar
        await prisma.product.upsert({
          where: { id: product.id },
          update: {
            name: product.name,
            description: product.description,
            category: product.category,
            brand: product.brand,
            family: product.family,
            subcategory: product.subcategory,
            model: product.model,
            isActive: product.isActive,
            ...(product.imageUrl ? { imageUrl: product.imageUrl, images: product.images } : {})
          },
          create: product
        });
      } else {
        // Si no tiene ID en el CSV, lo creamos
        await prisma.product.create({
          data: product
        });
      }
      successCount++;
    }

    return NextResponse.json({ success: true, count: successCount }, { status: 201 });
  } catch (error: any) {
    console.error("Error en la subida masiva de productos:", error);
    return NextResponse.json({ error: error.message || "Error al procesar la subida masiva." }, { status: 500 });
  }
}
