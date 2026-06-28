import React, { useState } from "react";
import { Product } from "@/types/product.types";
import { Button } from "@/components/atoms/Button";
import { useImageUpload } from "@/hooks/useImageUpload";

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
    
    let parsedValue: string | number | boolean = value;
    if (type === "number") {
      parsedValue = value === "" ? "" : Number(value);
    } else if (type === "checkbox") {
      parsedValue = (e.target as HTMLInputElement).checked;
    }
    
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const [isDragging, setIsDragging] = useState(false);

  const validateAndSetFile = (file: File) => {
    // 1. Validar tamaño (Max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("El archivo es demasiado grande. Máximo 5MB.");
      return;
    }
    
    // 2. Validar tipo
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Formato no soportado. Solo JPG, PNG o WEBP.");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const { uploadImage, isUploading } = useImageUpload();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalImageUrl = formData.imageUrl;

      if (imageFile) {
        const base64Url = await uploadImage(imageFile);
        if (base64Url) {
          finalImageUrl = base64Url;
        } else {
          setIsSubmitting(false);
          return; // El hook ya muestra el alert si hay error
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
        
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              validateAndSetFile(e.dataTransfer.files[0]);
            }
          }}
          style={{
            border: `2px dashed ${isDragging ? 'var(--color-primary)' : '#ccc'}`,
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: isDragging ? 'rgba(0,0,0,0.02)' : 'transparent',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            position: 'relative'
          }}
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          {imagePreview ? (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePreview} alt="Preview" style={{ maxWidth: "200px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setImageFile(null);
                  setImagePreview("");
                }}
                style={{
                  position: 'absolute', top: '-10px', right: '-10px',
                  background: 'var(--color-danger, #ef4444)', color: 'white',
                  border: 'none', borderRadius: '50%', width: '24px', height: '24px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                ✕
              </button>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '1rem', color: '#888' }}>☁️</div>
              <p style={{ margin: 0, fontWeight: 500 }}>Arrastra una imagen o haz clic para subir</p>
              <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>Formatos: JPG, PNG, WEBP (Max 5MB)</p>
            </div>
          )}
          <input 
            id="image-upload" 
            type="file" 
            accept="image/jpeg, image/png, image/webp" 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
          />
        </div>
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
