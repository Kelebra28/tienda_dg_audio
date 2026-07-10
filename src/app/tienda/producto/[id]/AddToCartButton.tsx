"use client";

import React from "react";
import { Product } from "@prisma/client";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import styles from "./AddToCartButton.module.css";

interface AddToCartButtonProps {
  product: Product;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product }) => {
  const { items, addToCart } = useCart();
  
  const cartItem = items.find(item => item.product.id === product.id);
  const currentQuantity = cartItem?.quantity || 0;
  // If product.stock is 0, we can assume it doesn't have stock limit currently, since we imported with stock 0 by default.
  // Wait, in previous components, stock <= 0 meant "Agotado". If we imported 5000 products with stock 0, they will all be "Agotado"!
  // Let me check how ProductCard handles it. In ProductCard: `const isOutOfStock = product.stock <= 0 || currentQuantity >= product.stock;`
  // Oh, that means all imported products are out of stock right now. This is a business logic issue, but I'll replicate the existing behavior.
  
  const isOutOfStock = product.stock <= 0 || currentQuantity >= product.stock;

  return (
    <button 
      className={styles.addToCartBtn} 
      onClick={() => addToCart(product)}
      disabled={isOutOfStock}
    >
      <ShoppingCart size={24} />
      {product.stock <= 0 ? "Agotado" : isOutOfStock ? "Límite alcanzado" : "Agregar al Carrito"}
    </button>
  );
};
