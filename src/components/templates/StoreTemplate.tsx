"use client";

import React, { useCallback } from "react";
import { Product } from "@prisma/client";
import { ProductCard } from "@/components/molecules/ProductCard";
import styles from "./StoreTemplate.module.css";
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface StoreTemplateProps {
  products: Product[];
  categories: string[];
  brands: string[];
  families: string[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export const StoreTemplate: React.FC<StoreTemplateProps> = ({ 
  products, 
  categories, 
  brands, 
  families, 
  currentPage, 
  totalPages, 
  totalCount 
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Helper function to update URL params
  const updateParams = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    // Always reset to page 1 when changing filters, unless we are explicitly changing the page
    if (key !== 'page') {
      params.set('page', '1');
    }
    router.push(`?${params.toString()}`);
  }, [searchParams, router]);

  const currentCategory = searchParams.get('category');
  const currentBrand = searchParams.get('brand');
  const currentFamily = searchParams.get('family');
  const currentSort = searchParams.get('sort') || '';

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid #e5e7eb' }}>
          <SlidersHorizontal size={20} color="#d4a437" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Filtros</h2>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Categoría</h3>
            <div className={styles.filterList}>
              <label className={`${styles.filterLabel} ${!currentCategory ? styles.active : ""}`}>
                <input 
                  type="radio" 
                  checked={!currentCategory}
                  onChange={() => updateParams('category', null)}
                  style={{ display: 'none' }}
                />
                Todas las categorías
              </label>
              {categories.map(cat => (
                <label key={cat} className={`${styles.filterLabel} ${currentCategory === cat ? styles.active : ""}`}>
                  <input 
                    type="radio" 
                    checked={currentCategory === cat}
                    onChange={() => updateParams('category', cat)}
                    style={{ display: 'none' }}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Brands */}
        {brands.length > 0 && (
          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Marca</h3>
            <div className={styles.filterList}>
              <label className={`${styles.filterLabel} ${!currentBrand ? styles.active : ""}`}>
                <input 
                  type="radio" 
                  checked={!currentBrand}
                  onChange={() => updateParams('brand', null)}
                  style={{ display: 'none' }}
                />
                Todas las marcas
              </label>
              {brands.map(brand => (
                <label key={brand} className={`${styles.filterLabel} ${currentBrand === brand ? styles.active : ""}`}>
                  <input 
                    type="radio" 
                    checked={currentBrand === brand}
                    onChange={() => updateParams('brand', brand)}
                    style={{ display: 'none' }}
                  />
                  {brand}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Families */}
        {families.length > 0 && (
          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Familia</h3>
            <div className={styles.filterList}>
              <label className={`${styles.filterLabel} ${!currentFamily ? styles.active : ""}`}>
                <input 
                  type="radio" 
                  checked={!currentFamily}
                  onChange={() => updateParams('family', null)}
                  style={{ display: 'none' }}
                />
                Todas las familias
              </label>
              {families.map(family => (
                <label key={family} className={`${styles.filterLabel} ${currentFamily === family ? styles.active : ""}`}>
                  <input 
                    type="radio" 
                    checked={currentFamily === family}
                    onChange={() => updateParams('family', family)}
                    style={{ display: 'none' }}
                  />
                  {family}
                </label>
              ))}
            </div>
          </div>
        )}

        {(currentCategory || currentBrand || currentFamily) && (
          <button 
            className={styles.clearFiltersBtn}
            onClick={() => router.push('/tienda')}
          >
            Limpiar todos los filtros
          </button>
        )}
      </aside>

      <div className={styles.grid}>
        <div className={styles.header}>
          <div className={styles.resultsCount}>
            <span style={{ fontWeight: 700, color: '#111827' }}>{totalCount}</span> productos encontrados
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>Ordenar por:</label>
            <select 
              value={currentSort}
              onChange={(e) => updateParams('sort', e.target.value || null)}
              className={styles.sortSelect}
            >
              <option value="">Más recientes</option>
              <option value="price_asc">Precio: de menor a mayor</option>
              <option value="price_desc">Precio: de mayor a menor</option>
              <option value="name_asc">Nombre: A - Z</option>
            </select>
          </div>
        </div>

        {products.length > 0 ? (
          <>
            <motion.div 
              key={currentPage + (currentCategory || '') + (currentBrand || '') + currentSort} // Force re-animation on filter/page change
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className={styles.productsGrid}
            >
              {products.map(product => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button 
                  disabled={currentPage <= 1}
                  onClick={() => updateParams('page', String(currentPage - 1))}
                  className={styles.pageBtn}
                >
                  <ChevronLeft size={20} /> Anterior
                </button>
                <div className={styles.pageInfo}>
                  Página <strong>{currentPage}</strong> de {totalPages}
                </div>
                <button 
                  disabled={currentPage >= totalPages}
                  onClick={() => updateParams('page', String(currentPage + 1))}
                  className={styles.pageBtn}
                >
                  Siguiente <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={styles.emptyState}
          >
            <div style={{ backgroundColor: '#f3f4f6', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
              <Search size={40} color="#9ca3af" />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>No se encontraron productos</h3>
            <p style={{ color: '#6b7280', fontSize: '1.1rem', maxWidth: '400px' }}>
              Intenta cambiar o quitar algunos filtros de búsqueda para ver más resultados.
            </p>
            <button 
              onClick={() => router.push('/tienda')}
              style={{
                marginTop: '2rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#111827',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#374151'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#111827'}
            >
              Limpiar todos los filtros
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
