import React, { useState } from "react";
import { Product } from "@/types/product.types";
import { Button } from "@/components/atoms/Button";
import { useImageUpload } from "@/hooks/useImageUpload";
import toast from "react-hot-toast";
import { ArrowLeft, ArrowRight, X, Star } from "lucide-react";

type ImageItem = 
  | { type: 'existing', url: string }
  | { type: 'new', file: File, previewUrl: string };

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

  const initialImages: ImageItem[] = (Array.isArray(initialData?.images) && initialData.images.length > 0
    ? initialData.images 
    : (initialData?.imageUrl ? [initialData.imageUrl] : [])).map((url: string) => ({ type: 'existing', url }));
    
  const [images, setImages] = useState<ImageItem[]>(initialImages);

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
    const addedFiles: ImageItem[] = [];

    Array.from(files).forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`El archivo ${file.name} supera los 5MB.`);
        return;
      }
      if (!validTypes.includes(file.type)) {
        toast.error(`Formato no soportado para ${file.name}.`);
        return;
      }
      addedFiles.push({ type: 'new', file, previewUrl: URL.createObjectURL(file) });
    });

    setImages(prev => [...prev, ...addedFiles]);
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left' && index === 0) return;
    if (direction === 'right' && index === images.length - 1) return;

    setImages(prev => {
      const newImages = [...prev];
      const newIndex = direction === 'left' ? index - 1 : index + 1;
      const temp = newImages[index];
      newImages[index] = newImages[newIndex];
      newImages[newIndex] = temp;
      return newImages;
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const loadingToast = toast.loading("Guardando producto...");
    
    try {
      const finalUrls: string[] = [];
      
      for (const item of images) {
        if (item.type === 'existing') {
          finalUrls.push(item.url);
        } else {
          const url = await uploadImage(item.file);
          if (url) {
            finalUrls.push(url);
          } else {
            throw new Error("No se pudo subir una de las imágenes");
          }
        }
      }

      const primaryImageUrl = finalUrls.length > 0 ? finalUrls[0] : null;

      await onSubmit({ 
        ...formData, 
        imageUrl: primaryImageUrl || "",
        images: finalUrls 
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
        {images.length > 0 && (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem', backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px', border: '1px solid #eee' }}>
            {images.map((item, i) => (
              <div key={i} style={{ 
                position: 'relative', 
                width: '120px', 
                height: '140px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: i === 0 ? "0 0 0 2px var(--color-primary)" : "0 2px 4px rgba(0,0,0,0.05)"
              }}>
                {i === 0 && (
                  <div style={{
                    position: 'absolute', top: '-10px', left: '-10px',
                    background: 'var(--color-primary)', color: 'white', padding: '4px 8px', borderRadius: '12px',
                    fontSize: '0.7rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px',
                    zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}>
                    <Star size={12} fill="white" /> Portada
                  </div>
                )}
                <div style={{ position: 'relative', width: '100%', height: '100px', borderRadius: '4px', overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.type === 'existing' ? item.url : item.previewUrl} alt={`img-${i}`} style={{ width: "100%", height: "100%", objectFit: 'cover' }} />
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                    style={{
                      position: 'absolute', top: '4px', right: '4px',
                      background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s'
                    }}
                    title="Eliminar imagen"
                  ><X size={14} /></button>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', width: '100%', justifyContent: 'space-between' }}>
                  <button 
                    type="button"
                    disabled={i === 0}
                    onClick={() => moveImage(i, 'left')}
                    style={{
                      background: i === 0 ? '#f3f4f6' : '#e5e7eb', color: i === 0 ? '#d1d5db' : '#374151', 
                      border: 'none', borderRadius: '4px', padding: '4px', flex: 1,
                      cursor: i === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    title="Mover a la izquierda"
                  ><ArrowLeft size={16} /></button>
                  <button 
                    type="button"
                    disabled={i === images.length - 1}
                    onClick={() => moveImage(i, 'right')}
                    style={{
                      background: i === images.length - 1 ? '#f3f4f6' : '#e5e7eb', color: i === images.length - 1 ? '#d1d5db' : '#374151', 
                      border: 'none', borderRadius: '4px', padding: '4px', flex: 1,
                      cursor: i === images.length - 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    title="Mover a la derecha"
                  ><ArrowRight size={16} /></button>
                </div>
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
