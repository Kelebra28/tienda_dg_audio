"use client";

import React, { useState } from "react";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import { Product } from "@/types/product.types";
import { Button } from "@/components/atoms/Button";
import { ProductForm } from "@/components/organisms/ProductForm";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function AdminProductsPage() {
  const { products, isLoading, error, addProduct, updateProduct, deleteProduct } = useAdminProducts();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleOpenForm = (product?: Product) => {
    setEditingProduct(product || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (data: Partial<Product>) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, data);
    } else {
      await addProduct(data);
    }
    handleCloseForm();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar (desactivar) este producto?")) {
      await deleteProduct(id);
    }
  };

  if (isLoading && products.length === 0) {
    return <div>Cargando productos...</div>;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="section-title" style={{ margin: 0, fontSize: "2rem" }}>Gestión de Productos</h1>
        <Button onClick={() => handleOpenForm()} style={{ display: "flex", gap: "0.5rem" }}>
          <Plus size={20} />
          Nuevo Producto
        </Button>
      </div>

      {error && (
        <div style={{ padding: "1rem", backgroundColor: "#ffebee", color: "#c62828", borderRadius: "8px", marginBottom: "2rem" }}>
          Error: {error}
        </div>
      )}

      {isFormOpen ? (
        <div style={{ marginBottom: "2rem" }}>
          <ProductForm 
            initialData={editingProduct || undefined} 
            onSubmit={handleSubmit} 
            onCancel={handleCloseForm} 
          />
        </div>
      ) : (
        <div style={{ backgroundColor: "var(--bg-primary)", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead style={{ backgroundColor: "var(--bg-secondary)", borderBottom: "1px solid #eee" }}>
              <tr>
                <th style={{ padding: "1rem" }}>Producto</th>
                <th style={{ padding: "1rem" }}>Precio</th>
                <th style={{ padding: "1rem" }}>Stock</th>
                <th style={{ padding: "1rem" }}>Estado</th>
                <th style={{ padding: "1rem", textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ fontWeight: 600 }}>{product.name}</div>
                    <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                      {product.description.substring(0, 50)}...
                    </div>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    ${product.price.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: "1rem" }}>{product.stock}</td>
                  <td style={{ padding: "1rem" }}>
                    {product.isActive ? (
                      <span style={{ backgroundColor: "#e8f5e9", color: "#2e7d32", padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.875rem", fontWeight: 600 }}>
                        Activo
                      </span>
                    ) : (
                      <span style={{ backgroundColor: "#ffebee", color: "#c62828", padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.875rem", fontWeight: 600 }}>
                        Inactivo
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "1rem", textAlign: "right" }}>
                    <button 
                      onClick={() => handleOpenForm(product)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-accent)", marginRight: "1rem" }}
                      title="Editar"
                    >
                      <Edit size={20} />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#c62828" }}
                      title="Eliminar"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                    No hay productos registrados. Crea uno nuevo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
