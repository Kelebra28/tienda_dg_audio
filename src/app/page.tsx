import { ProductCard } from "@/components/molecules/ProductCard";
import { Product } from "@prisma/client";
import { Button } from "@/components/atoms/Button";
import prisma from "@/lib/prisma";

export default async function HomePage() {
  // Obtenemos los productos reales de la base de datos que estén activos
  const dbProducts = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" }
  });

  // Prisma devuelve Decimal o Float, nos aseguramos del tipado para la vista
  const products: Product[] = dbProducts.map(p => ({
    ...p,
    price: Number(p.price)
  }));
  return (
    <div>
      {/* Hero Section */}
      <section style={{ backgroundColor: "var(--bg-secondary)", padding: "4rem 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span className="eyebrow">Nueva Colección</span>
          <h1 className="section-title" style={{ marginBottom: "1.5rem" }}>
            Equipa tu auto con <span className="text-accent">Sonido Premium</span>
          </h1>
          <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto 2rem", fontSize: "1.125rem" }}>
            En DG Audiosound tenemos los mejores equipos, accesorios e instalaciones para llevar tu experiencia auditiva al siguiente nivel.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <Button variant="primary">Ver Catálogo</Button>
            <Button style={{ backgroundColor: "transparent", color: "var(--text-main)", border: "1px solid var(--text-main)" }}>
              Saber más
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section style={{ padding: "5rem 0" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem" }}>
            <div>
              <span className="eyebrow">Productos Destacados</span>
              <h2 className="section-title" style={{ fontSize: "2rem" }}>Lo más vendido</h2>
            </div>
            <Button style={{ backgroundColor: "transparent", color: "var(--color-accent)", padding: 0 }}>
              Ver todos →
            </Button>
          </div>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
            gap: "2rem" 
          }}>
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                />
              ))
            ) : (
              <p style={{ color: "var(--text-muted)" }}>Aún no hay productos en la tienda.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
