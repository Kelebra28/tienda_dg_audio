import React, { useState } from "react";
import { Product } from "@/types/product.types";
import { Button } from "@/components/atoms/Button";
import { useImageUpload } from "@/hooks/useImageUpload";
import toast from "react-hot-toast";

interface ProductFormProps {
  initialData?: Partial<Product>;
  onSubmit: (data: Partial<Product>) => Promise<void>;
  onCancel: () => void;
}

export const ProductForm = ({ initialData, onSubmit, onCancel }: ProductFormProps) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    stock: initialData?.stock || 0,
    isActive: initialData?.isActive !== false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { uploadImage, isUploading } = useImageUpload();

  const [existingUrls, setExistingUrls] = useState<string[]>(
    Array.isArray(initialData?.images) 
      ? initialData.images 
      : (initialData?.imageUrl ? [initialData.imageUrl] : [])
  );
  const [newFiles, setNewFiles] = useState<{file: File, previewUrl: string}[]>([]);

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

  const validateAndAddFiles = (files: FileList | File[]) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const addedFiles: {file: File, previewUrl: string}[] = [];

    Array.from(files).forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`El archivo ${file.name} supera los 5MB.`);
        return;
      }
      if (!validTypes.includes(file.type)) {
        toast.error(`Formato no soportado para ${file.name}.`);
        return;
      }
      addedFiles.push({ file, previewUrl: URL.createObjectURL(file) });
    });

    setNewFiles(prev => [...prev, ...addedFiles]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const loadingToast = toast.loading("Guardando producto...");
    
    try {
      // Upload new files
      const uploadedUrls: string[] = [];
      for (const { file } of newFiles) {
        const url = await uploadImage(file);
        if (url) {
          uploadedUrls.push(url);
        } else {
          throw new Error("No se pudo subir una de las imágenes");
        }
      }

      // Combine existing and newly uploaded URLs
      const finalImages = [...existingUrls, ...uploadedUrls];
      const primaryImageUrl = finalImages.length > 0 ? finalImages[0] : null;

      await onSubmit({ 
        ...formData, 
        imageUrl: primaryImageUrl || "",
        images: finalImages 
      });
      
      toast.dismiss(loadingToast);
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error("Ocurrió un error al guardar el producto", { id: loadingToast });
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

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Stock</label>
          <input required type="number" name="stock" value={formData.stock as number} onChange={handleChange} style={inputStyle} />
        </div>
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Imágenes del Producto</label>
        
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              validateAndAddFiles(e.dataTransfer.files);
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
            position: 'relative',
            marginBottom: '1rem'
          }}
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '1rem', color: '#888' }}>☁️</div>
            <p style={{ margin: 0, fontWeight: 500 }}>Arrastra múltiples imágenes o haz clic para subir</p>
            <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>Formatos: JPG, PNG, WEBP (Max 5MB)</p>
          </div>
          <input 
            id="image-upload" 
            type="file" 
            multiple
            accept="image/jpeg, image/png, image/webp" 
            onChange={(e) => {
              if (e.target.files) validateAndAddFiles(e.target.files);
              e.target.value = ''; // Reset input
            }} 
            style={{ display: 'none' }} 
          />
        </div>

        {/* Previsualización de Imágenes */}
        {(existingUrls.length > 0 || newFiles.length > 0) && (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {existingUrls.map((url, i) => (
              <div key={`exist-${i}`} style={{ position: 'relative' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`img-${i}`} style={{ width: "100px", height: "100px", objectFit: 'cover', borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                <button 
                  type="button"
                  onClick={() => setExistingUrls(prev => prev.filter((_, idx) => idx !== i))}
                  style={{
                    position: 'absolute', top: '-8px', right: '-8px',
                    background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >✕</button>
              </div>
            ))}
            {newFiles.map((f, i) => (
              <div key={`new-${i}`} style={{ position: 'relative' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.previewUrl} alt={`new-img-${i}`} style={{ width: "100px", height: "100px", objectFit: 'cover', borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                <button 
                  type="button"
                  onClick={() => setNewFiles(prev => prev.filter((_, idx) => idx !== i))}
                  style={{
                    position: 'absolute', top: '-8px', right: '-8px',
                    background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}>
        <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive as boolean} onChange={handleChange} />
        <label htmlFor="isActive" style={{ fontWeight: 500 }}>Producto Activo (Visible en tienda)</label>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
        <Button type="button" variant="outline" onClick={onCancel} style={{ backgroundColor: "transparent", color: "var(--text-main)", border: "1px solid #ccc" }}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting || isUploading}>
          {isSubmitting || isUploading ? "Guardando..." : "Guardar Producto"}
        </Button>
      </div>
    </form>
  );
};
