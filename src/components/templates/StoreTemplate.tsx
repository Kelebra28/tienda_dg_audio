"use client";

import React, { useState, useMemo } from "react";
import { Product } from "@prisma/client";
import { ProductCard } from "@/components/molecules/ProductCard";
import styles from "./StoreTemplate.module.css";
import { Search } from "lucide-react";

interface StoreTemplateProps {
  products: Product[];
}

export const StoreTemplate: React.FC<StoreTemplateProps> = ({ products }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  // Extraer categorías y marcas únicas para los filtros
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return Array.from(cats) as string[];
  }, [products]);

  const brands = useMemo(() => {
    const brnds = new Set(products.map(p => p.brand).filter(Boolean));
    return Array.from(brnds) as string[];
  }, [products]);

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedBrand && p.brand !== selectedBrand) return false;
      return true;
    });
  }, [products, selectedCategory, selectedBrand]);

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.filterGroup}>
          <h3 className={styles.filterTitle}>Categorías</h3>
          <div className={styles.filterList}>
            <label className={`${styles.filterLabel} ${selectedCategory === null ? styles.active : ""}`}>
              <input 
                type="radio" 
                name="category" 
                checked={selectedCategory === null}
                onChange={() => setSelectedCategory(null)}
                style={{ display: 'none' }}
              />
              Todas las categorías
            </label>
            {categories.map(cat => (
              <label key={cat} className={`${styles.filterLabel} ${selectedCategory === cat ? styles.active : ""}`}>
                <input 
                  type="radio" 
                  name="category" 
                  checked={selectedCategory === cat}
                  onChange={() => setSelectedCategory(cat)}
                  style={{ display: 'none' }}
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        {brands.length > 0 && (
          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Marcas</h3>
            <div className={styles.filterList}>
              <label className={`${styles.filterLabel} ${selectedBrand === null ? styles.active : ""}`}>
                <input 
                  type="radio" 
                  name="brand" 
                  checked={selectedBrand === null}
                  onChange={() => setSelectedBrand(null)}
                  style={{ display: 'none' }}
                />
                Todas las marcas
              </label>
              {brands.map(brand => (
                <label key={brand} className={`${styles.filterLabel} ${selectedBrand === brand ? styles.active : ""}`}>
                  <input 
                    type="radio" 
                    name="brand" 
                    checked={selectedBrand === brand}
                    onChange={() => setSelectedBrand(brand)}
                    style={{ display: 'none' }}
                  />
                  {brand}
                </label>
              ))}
            </div>
          </div>
        )}
      </aside>

      <div className={styles.grid}>
        <div className={styles.header}>
          <div className={styles.resultsCount} style={{ fontSize: '1.1rem', fontWeight: 600 }}>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className={styles.productsGrid}>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Search size={48} opacity={0.2} style={{ marginBottom: '1rem' }} />
            <h3>No se encontraron productos</h3>
            <p>Intenta cambiar los filtros de búsqueda.</p>
            <button 
              onClick={() => { setSelectedCategory(null); setSelectedBrand(null); }}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--text-main)',
                color: 'var(--text-inverse)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
