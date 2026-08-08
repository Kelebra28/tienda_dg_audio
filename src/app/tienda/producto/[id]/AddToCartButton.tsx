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
  const { addToCart } = useCart();
  
  return (
    <button 
      className={styles.addToCartBtn} 
      onClick={() => addToCart(product)}
    >
      <ShoppingCart size={24} />
      Agregar a Cotización
    </button>
  );
};
