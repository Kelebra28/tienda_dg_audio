import React, { useState } from "react";
import { Product } from "@/types/product.types";
import { Button } from "@/components/atoms/Button";
import imageCompression from "browser-image-compression";

interface ProductFormProps {
  initialData?: Partial<Product>;
  onSubmit: (data: Partial<Product>) => Promise<void>;
  onCancel: () => void;
}

export const ProductForm = ({ initialData, onSubmit, onCancel }: ProductFormProps) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
    imageUrl: initialData?.imageUrl || "",
    isActive: initialData?.isActive !== false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialData?.imageUrl || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let parsedValue: any = value;
    if (type === "number") {
      parsedValue = value === "" ? "" : Number(value);
    } else if (type === "checkbox") {
      parsedValue = (e.target as HTMLInputElement).checked;
    }
    
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalImageUrl = formData.imageUrl;

      if (imageFile) {
        // 1. Comprimir la imagen
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(imageFile, options);

        // 2. Subir al servidor local
        const uploadData = new FormData();
        uploadData.append("file", compressedFile);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });

        const result = await response.json();
        if (result.success) {
          finalImageUrl = result.url;
        } else {
          alert("Error subiendo la imagen");
          return;
        }
      }

      await onSubmit({ ...formData, imageUrl: finalImageUrl });
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Ocurrió un error al guardar el producto");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontFamily: "var(--font-body)",
    marginBottom: "1rem",
  };

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: "var(--bg-primary)", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
      <h3 style={{ marginBottom: "1.5rem" }}>
        {initialData ? "Editar Producto" : "Nuevo Producto"}
      </h3>
      
      <div>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Nombre del producto</label>
        <input required type="text" name="name" value={formData.name as string} onChange={handleChange} style={inputStyle} />
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Descripción</label>
        <textarea required name="description" value={formData.description as string} onChange={handleChange} style={{ ...inputStyle, minHeight: "100px" }} />
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Precio ($)</label>
          <input required type="number" step="0.01" name="price" value={formData.price as number} onChange={handleChange} style={inputStyle} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Stock</label>
          <input required type="number" name="stock" value={formData.stock as number} onChange={handleChange} style={inputStyle} />
        </div>
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Imagen del Producto</label>
        {imagePreview && (
          <div style={{ marginBottom: "1rem" }}>
            <img src={imagePreview} alt="Preview" style={{ maxWidth: "200px", borderRadius: "8px", border: "1px solid #ccc" }} />
          </div>
        )}
        <input type="file" accept="image/*" onChange={handleFileChange} style={inputStyle} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}>
        <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive as boolean} onChange={handleChange} />
        <label htmlFor="isActive" style={{ fontWeight: 500 }}>Producto Activo (Visible en tienda)</label>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
        <Button type="button" variant="outline" onClick={onCancel} style={{ backgroundColor: "transparent", color: "var(--text-main)", border: "1px solid #ccc" }}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar Producto"}
        </Button>
      </div>
    </form>
  );
};
