import { PrismaClient } from "@prisma/client";
import { StoreTemplate } from "@/components/templates/StoreTemplate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo | DG Audiosound",
  description: "Explora nuestro catálogo de productos de audio y accesorios premium.",
};

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

interface TiendaPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TiendaPage({ searchParams }: TiendaPageProps) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page) || 1;
  const limit = 24;
  const skip = (page - 1) * limit;

  const category = typeof resolvedParams.category === 'string' ? resolvedParams.category : undefined;
  const brand = typeof resolvedParams.brand === 'string' ? resolvedParams.brand : undefined;
  const family = typeof resolvedParams.family === 'string' ? resolvedParams.family : undefined;
  const subcategory = typeof resolvedParams.subcategory === 'string' ? resolvedParams.subcategory : undefined;
  const sort = typeof resolvedParams.sort === 'string' ? resolvedParams.sort : undefined;

  const where: any = { isActive: true };
  if (category) where.category = category;
  if (brand) where.brand = brand;
  if (family) where.family = family;
  if (subcategory) where.subcategory = subcategory;

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  if (sort === 'price_desc') orderBy = { price: 'desc' };
  if (sort === 'name_asc') orderBy = { name: 'asc' };

  const [products, totalCount, categoriesRaw, brandsRaw, familiesRaw] = await Promise.all([
    prisma.product.findMany({ where, orderBy, skip, take: limit }),
    prisma.product.count({ where }),
    prisma.product.findMany({ select: { category: true }, distinct: ['category'], where: { isActive: true, category: { not: null } } }),
    prisma.product.findMany({ select: { brand: true }, distinct: ['brand'], where: { isActive: true, brand: { not: null } } }),
    prisma.product.findMany({ select: { family: true }, distinct: ['family'], where: { isActive: true, family: { not: null } } })
  ]);

  const categories = categoriesRaw.map(c => c.category as string).sort();
  const brands = brandsRaw.map(b => b.brand as string).sort();
  const families = familiesRaw.map(f => f.family as string).sort();
  
  const totalPages = Math.ceil(totalCount / limit);

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
            background: 'url(/bg-pattern.svg) center/cover',
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
      <div className="section-light-alt" style={{ minHeight: '100vh', paddingBottom: '4rem', paddingTop: '2rem', backgroundColor: '#f9fafb' }}>
        <StoreTemplate 
          products={products} 
          categories={categories}
          brands={brands}
          families={families}
          currentPage={page}
          totalPages={totalPages}
          totalCount={totalCount}
        />
      </div>
    </>
  );
}
