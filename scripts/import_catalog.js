const fs = require('fs');
const Papa = require('papaparse');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const filePath = 'Catalogo_Maestro_DG_Audiosound_V53_AH_Pro_Integrado_REVISION_FINAL (2).csv';
  const csvText = fs.readFileSync(filePath, 'utf8');
  
  const results = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  console.log(`Leídas ${results.data.length} filas del CSV.`);

  const mappedProducts = results.data.map(row => {
    const costoSinIva = parseFloat(row.Costo_Original_sin_IVA) || 0;
    return {
      name: row.Producto_Comercial || "Sin Nombre",
      description: row.Descripcion_Corta || "",
      priceWithoutIva: costoSinIva,
      price: costoSinIva * 1.16,
      stock: 0,
      category: row.Categoria || null,
      brand: row.Marca || null,
      family: row.Familia_Catalogo || null,
      subcategory: row.Subcategoria || null,
      model: row.Modelo || null,
      currency: row.Moneda_Final || "MXN",
      isActive: true,
    };
  });

  console.log('Borrando productos existentes...');
  await prisma.product.deleteMany({});
  
  console.log('Insertando nuevos productos...');
  const result = await prisma.product.createMany({
    data: mappedProducts
  });

  console.log(`¡Insertados ${result.count} productos exitosamente!`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
