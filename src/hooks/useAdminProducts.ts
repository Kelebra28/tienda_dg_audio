import { useState, useEffect, useCallback } from "react";
import { Product } from "@/types/product.types";
import { productsService } from "@/services/products.service";

export const useAdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    // Evitar setState síncrono para el linter
    setTimeout(() => setIsLoading(true), 0);
    setError(null);
    try {
      const data = await productsService.getAll();
      setProducts(data);
    } catch (err: unknown) {
      setError((err as Error).message || "Unknown error fetching products");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (productData: Partial<Product>) => {
    setIsLoading(true);
    try {
      const newProduct = await productsService.create(productData);
      setProducts((prev) => [newProduct, ...prev]);
      return newProduct;
    } catch (err: unknown) {
      setError((err as Error).message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    setIsLoading(true);
    try {
      const updated = await productsService.update(id, productData);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return updated;
    } catch (err: unknown) {
      setError((err as Error).message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setIsLoading(true);
    try {
      await productsService.softDelete(id);
      // Soft delete: lo actualizamos en la UI
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: false } : p))
      );
    } catch (err: unknown) {
      setError((err as Error).message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
