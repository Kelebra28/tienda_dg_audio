import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { AddToCartButton } from "./AddToCartButton";
import { ChevronRight } from "lucide-react";
import { Metadata } from "next";
import { ProductCard } from "@/components/molecules/ProductCard";

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!product) return { title: "Producto no encontrado" };

  return {
    title: `${product.name} | DG Audiosound`,
    description: product.description.substring(0, 160),
  };
}

export default async function ProductDetailsPage({ params }: Props) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  // Fetch related products (same category or brand)
  const relatedProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      id: { not: product.id },
      OR: [
        { category: product.category },
        { brand: product.brand }
      ]
    },
    take: 4,
    orderBy: { createdAt: 'desc' }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: product.currency || 'MXN' }).format(price);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      {/* Breadcrumbs Header */}
      <div 
        className="section-black"
        style={{ 
          paddingTop: '120px', 
          paddingBottom: '40px', 
          background: 'linear-gradient(to right, #1c1f26 0%, #050505 100%)',
          color: 'white',
          borderBottom: '1px solid #333'
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>
          <Link href="/tienda" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.2s' }}>
            Catálogo
          </Link>
          <ChevronRight size={14} />
          {product.category && (
            <>
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>{product.category}</span>
              <ChevronRight size={14} />
            </>
          )}
          <span style={{ color: '#d4a437', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {product.name}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem', alignItems: 'flex-start' }}>
          
          {/* Image Gallery Column */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', position: 'relative', aspectRatio: '1/1' }}>
            {product.imageUrl ? (
              <Image 
                src={product.imageUrl} 
                alt={product.name}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', color: '#9ca3af' }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px' }}>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <span style={{ fontSize: '1.125rem', fontWeight: 500 }}>Sin foto disponible</span>
              </div>
            )}
          </div>

          {/* Product Details Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              {product.brand && (
                <div style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  {product.brand}
                </div>
              )}
              <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#111827', lineHeight: 1.2, marginBottom: '0.5rem' }}>
                {product.name}
              </h1>
              {product.model && (
                <div style={{ color: '#6b7280', fontSize: '1rem' }}>
                  Modelo: <span style={{ fontWeight: 500, color: '#374151' }}>{product.model}</span>
                </div>
              )}
            </div>

            {/* Tags/Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {product.family && (
                <span style={{ backgroundColor: '#eef2ff', color: '#4f46e5', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600 }}>
                  {product.family}
                </span>
              )}
              {product.subcategory && (
                <span style={{ backgroundColor: '#f0fdf4', color: '#16a34a', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600 }}>
                  {product.subcategory}
                </span>
              )}
            </div>

            {/* Price Section */}
            <div style={{ padding: '1.5rem 0', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#111827' }}>
                  {formatPrice(product.price)}
                </span>
                <span style={{ fontSize: '1rem', color: '#6b7280' }}>
                  Incluye IVA (16%)
                </span>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                Precio sin IVA: {formatPrice(product.priceWithoutIva)} {product.currency}
              </div>
            </div>

            {/* Description */}
            <div style={{ color: '#4b5563', lineHeight: 1.7, fontSize: '1rem', whiteSpace: 'pre-line' }}>
              {product.description || "Este producto no tiene una descripción detallada en el catálogo."}
            </div>

            {/* Action Buttons */}
            <div style={{ marginTop: '1rem' }}>
              <AddToCartButton product={product} />
              {product.stock <= 0 && (
                <p style={{ textAlign: 'center', color: '#ef4444', fontSize: '0.875rem', marginTop: '0.75rem', fontWeight: 500 }}>
                  Actualmente sin inventario.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div style={{ backgroundColor: 'white', padding: '5rem 0' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
                  Productos Relacionados
                </h2>
                <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
                  Complementa tu equipo con estas sugerencias.
                </p>
              </div>
              <Link 
                href="/tienda" 
                style={{ color: '#d4a437', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                Ver todo <ChevronRight size={20} />
              </Link>
            </div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '2rem' 
            }}>
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
