"use client";

import React, { useState } from "react";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import { Product } from "@/types/product.types";
import { Button } from "@/components/atoms/Button";
import { ProductForm } from "@/components/organisms/ProductForm";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const { products, isLoading, error, addProduct, updateProduct, toggleProductStatus, hardDeleteProduct } = useAdminProducts();
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
    const action = editingProduct 
      ? updateProduct(editingProduct.id, data) 
      : addProduct(data);
      
    toast.promise(action, {
      loading: editingProduct ? "Actualizando producto..." : "Guardando producto...",
      success: editingProduct ? "Producto actualizado correctamente" : "Producto creado correctamente",
      error: (err) => err.message || "Error al guardar el producto"
    });

    try {
      await action;
      handleCloseForm();
    } catch (e) {
      // Error manejado por toast
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    toast.promise(toggleProductStatus(id, currentStatus), {
      loading: currentStatus ? "Deshabilitando..." : "Habilitando...",
      success: currentStatus ? "Producto deshabilitado (oculto)" : "Producto habilitado (visible)",
      error: (err) => err.message || "Error al cambiar estado"
    });
  };

  const confirmDelete = (id: string, name: string) => {
    toast((t) => (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <p style={{ margin: 0, fontWeight: 500 }}>¿Eliminar permanentemente <b>{name}</b>?</p>
        <p style={{ margin: 0, fontSize: "0.85rem", color: "#666" }}>Esta acción no se puede deshacer.</p>
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
          <button 
            onClick={() => toast.dismiss(t.id)}
            style={{ padding: "0.25rem 0.75rem", borderRadius: "4px", border: "1px solid #ccc", background: "white", cursor: "pointer" }}
          >
            Cancelar
          </button>
          <button 
            onClick={() => {
              toast.dismiss(t.id);
              handleDelete(id);
            }}
            style={{ padding: "0.25rem 0.75rem", borderRadius: "4px", border: "none", background: "#ef4444", color: "white", cursor: "pointer" }}
          >
            Eliminar Físicamente
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const handleDelete = async (id: string) => {
    toast.promise(hardDeleteProduct(id), {
      loading: "Eliminando producto...",
      success: "Producto eliminado permanentemente",
      error: (err) => err.message || "Error al eliminar"
    });
  };

  if (isLoading && products.length === 0) {
    return (
      <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ width: "200px", height: "40px", background: "#f0f0f0", borderRadius: "8px", animation: "pulse 1.5s infinite" }} />
          <div style={{ width: "150px", height: "40px", background: "#f0f0f0", borderRadius: "8px", animation: "pulse 1.5s infinite" }} />
        </div>
        <div style={{ width: "100%", height: "400px", background: "#f0f0f0", borderRadius: "12px", animation: "pulse 1.5s infinite" }} />
        <style>{`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}</style>
      </div>
    );
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
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-accent)", marginRight: "0.75rem" }}
                      title="Editar"
                    >
                      <Edit size={20} />
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(product.id, product.isActive)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: product.isActive ? "#666" : "#2e7d32", marginRight: "0.75rem" }}
                      title={product.isActive ? "Deshabilitar" : "Habilitar"}
                    >
                      {product.isActive ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    <button 
                      onClick={() => confirmDelete(product.id, product.name)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#c62828" }}
                      title="Eliminar permanentemente"
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
