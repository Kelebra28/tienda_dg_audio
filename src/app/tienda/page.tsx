import { PrismaClient } from "@prisma/client";
import { StoreTemplate } from "@/components/templates/StoreTemplate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo | DG Audiosound",
  description: "Explora nuestro catálogo de productos de audio y accesorios premium.",
};

const prisma = new PrismaClient();

export default async function TiendaPage() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <>
      <div 
        className="section-black" 
        style={{ 
          paddingTop: '160px', 
          paddingBottom: '100px', 
          textAlign: 'center',
          background: 'radial-gradient(circle at center, #1c1f26 0%, #050505 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url(/bg-pattern.svg) center/cover', // Opcional si tienes un patrón, no romperá si no existe
            opacity: 0.03,
            pointerEvents: 'none'
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-block', border: '1px solid rgba(212, 164, 55, 0.3)', padding: '0.4rem 1rem', borderRadius: '99px', marginBottom: '1.5rem', color: '#d4a437', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Experiencia Premium
          </div>
          <h1 className="section-title text-white" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Catálogo de <span className="text-accent" style={{ color: '#d4a437' }}>Productos</span>
          </h1>
          <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Encuentra los mejores equipos, accesorios e instalaciones para llevar tu experiencia auditiva al siguiente nivel.
          </p>
        </div>
      </div>
      <div className="section-light-alt" style={{ minHeight: '100vh', paddingBottom: '4rem', paddingTop: '2rem' }}>
        <StoreTemplate products={products} />
      </div>
    </>
  );
}
