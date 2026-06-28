"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@prisma/client";
import { useCart } from "@/context/CartContext";
import styles from "./ProductCard.module.css";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { items, addToCart } = useCart();
  
  const cartItem = items.find(item => item.product.id === product.id);
  const currentQuantity = cartItem?.quantity || 0;
  const isOutOfStock = product.stock <= 0 || currentQuantity >= product.stock;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price);
  };

  return (
    <div className={styles.card}>
      <Link href={`/tienda/producto/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className={styles.imageContainer}>
          {product.imageUrl ? (
            <Image 
              src={product.imageUrl} 
              alt={product.name}
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>Sin imagen</span>
            </div>
          )}
        </div>
      </Link>
      
      <div className={styles.content}>
        <div className={styles.category}>{product.category || "General"}</div>
        <Link href={`/tienda/producto/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 className={styles.title}>{product.name}</h3>
        </Link>
        <div className={styles.price}>{formatPrice(product.price)}</div>
        
        <button 
          className={styles.addToCartBtn} 
          onClick={() => addToCart(product)}
          disabled={isOutOfStock}
          style={{ opacity: isOutOfStock ? 0.5 : 1, cursor: isOutOfStock ? 'not-allowed' : 'pointer' }}
        >
          <ShoppingCart size={16} />
          {product.stock <= 0 ? "Agotado" : isOutOfStock ? "Límite alcanzado" : "Agregar"}
        </button>
      </div>
    </div>
  );
};
