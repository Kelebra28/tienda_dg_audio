import React, { useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { useImageUpload } from "@/hooks/useImageUpload";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Eye, FileText, Settings, Sparkles, X, Globe, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

interface Post {
  id?: string;
  title: string;
  slug: string;
  content: string;
  imageUrl?: string | null;
  published: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
}

interface PostFormProps {
  initialData?: Partial<Post>;
  onSubmit: (data: Partial<Post>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const PostForm = ({ initialData, onSubmit, onCancel, isSubmitting }: PostFormProps) => {
  const [formData, setFormData] = useState<Partial<Post>>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    imageUrl: initialData?.imageUrl || null,
    published: initialData?.published || false,
    seoTitle: initialData?.seoTitle || "",
    seoDescription: initialData?.seoDescription || "",
  });

  const [activeTab, setActiveTab] = useState<"editor" | "preview" | "seo">("editor");
  const [slugManualEdited, setSlugManualEdited] = useState(false);
  const { uploadImage, isUploading } = useImageUpload();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (initialData?.slug) {
      setSlugManualEdited(true);
    }
  }, [initialData]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const titleVal = e.target.value;
    setFormData((prev) => {
      const updated = { ...prev, title: titleVal };
      if (!slugManualEdited) {
        updated.slug = slugify(titleVal);
      }
      return updated;
    });
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slugVal = e.target.value;
    setSlugManualEdited(true);
    setFormData((prev) => ({ ...prev, slug: slugify(slugVal) }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: string | boolean = value;
    if (type === "checkbox") {
      parsedValue = (e.target as HTMLInputElement).checked;
    }
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("El archivo supera los 5MB.");
      return;
    }
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Formato no soportado (JPG, PNG o WEBP).");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, imageUrl: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalImageUrl = formData.imageUrl;

    if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile);
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
      } else {
        return;
      }
    }

    onSubmit({
      ...formData,
      imageUrl: finalImageUrl
    });
  };

  // Helper styles for glassmorphic elements
  const cardStyle = {
    background: "rgba(255, 255, 255, 0.75)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(0, 0, 0, 0.06)",
    borderRadius: "16px",
    padding: "2rem",
    boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.05)"
  };

  const inputStyle = {
    width: "100%",
    padding: "0.85rem 1rem",
    borderRadius: "10px",
    border: "1px solid rgba(0,0,0,0.12)",
    fontSize: "1rem",
    backgroundColor: "var(--bg-primary)",
    color: "var(--text-main)",
    outline: "none",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Premium Tab Navigation Bar */}
      <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid rgba(0, 0, 0, 0.08)", paddingBottom: "0.5rem" }}>
        {(["editor", "preview", "seo"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.25rem",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.95rem",
              transition: "all 0.2s ease",
              backgroundColor: activeTab === tab ? "rgba(212, 164, 55, 0.08)" : "transparent",
              color: activeTab === tab ? "var(--color-accent)" : "var(--text-muted)"
            }}
          >
            {tab === "editor" && <FileText size={16} />}
            {tab === "preview" && <Eye size={16} />}
            {tab === "seo" && <Settings size={16} />}
            {tab === "editor" ? "Editor" : tab === "preview" ? "Vista Previa" : "Ajustes SEO"}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "2rem", alignItems: "start" }}>
        
        {/* Left Side: Dynamic Workspace Area */}
        <div style={{ ...cardStyle, flex: 1, minHeight: "500px" }}>
          <AnimatePresence mode="wait">
            {activeTab === "editor" && (
              <motion.div
                key="editor-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontWeight: 600, color: "var(--text-main)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Título del Artículo
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    required
                    placeholder="Escribe un título atractivo..."
                    style={inputStyle}
                    className="focus-glow"
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontWeight: 600, color: "var(--text-main)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Enlace Permanente (Slug)
                  </label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <span style={{ position: "absolute", left: "1rem", color: "var(--text-muted)", fontSize: "0.95rem", pointerEvents: "none" }}>
                      /blog/
                    </span>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleSlugChange}
                      required
                      placeholder="slug-del-articulo"
                      style={{ ...inputStyle, paddingLeft: "4rem", fontFamily: "monospace" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontWeight: 600, color: "var(--text-main)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Contenido del Post
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    rows={15}
                    placeholder="Utiliza Markdown o HTML para escribir este fantástico artículo..."
                    style={{ ...inputStyle, fontFamily: "monospace", resize: "vertical", minHeight: "350px" }}
                  />
                </div>
              </motion.div>
            )}

            {activeTab === "preview" && (
              <motion.div
                key="preview-tab"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ padding: "0.5rem" }}
              >
                <div style={{ paddingBottom: "1.5rem", borderBottom: "1px solid rgba(0,0,0,0.06)", marginBottom: "1.5rem" }}>
                  <h1 style={{ fontSize: "2.25rem", margin: "0 0 0.5rem 0", color: "var(--text-main)", fontWeight: 700 }}>
                    {formData.title || "Artículo sin título"}
                  </h1>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>
                    Vista Previa del artículo en tiempo real
                  </p>
                </div>
                {imagePreview && (
                  <div style={{ width: "100%", maxHeight: "300px", overflow: "hidden", borderRadius: "10px", marginBottom: "1.5rem" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} alt="Cover image" style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }} />
                  </div>
                )}
                <div 
                  style={{ fontSize: "1.05rem", lineHeight: "1.75", whiteSpace: "pre-line" }}
                  dangerouslySetInnerHTML={{ __html: formData.content || "<p style='color:var(--text-muted);'>No hay contenido para mostrar.</p>" }}
                />
              </motion.div>
            )}

            {activeTab === "seo" && (
              <motion.div
                key="seo-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
              >
                <div style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: "1rem" }}>
                  <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Sparkles size={18} style={{ color: "var(--color-accent)" }} /> Optimización SEO para Motores de Búsqueda
                  </h3>
                  <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    Controla cómo aparece este artículo en Google.
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontWeight: 600, color: "var(--text-main)", fontSize: "0.9rem" }}>SEO Título</label>
                  <input
                    type="text"
                    name="seoTitle"
                    value={formData.seoTitle || ""}
                    onChange={handleChange}
                    placeholder="Título SEO sugerido (max 60 caracteres)"
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontWeight: 600, color: "var(--text-main)", fontSize: "0.9rem" }}>SEO Descripción</label>
                  <textarea
                    name="seoDescription"
                    value={formData.seoDescription || ""}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Escribe un resumen atractivo para las búsquedas de Google (max 160 caracteres)..."
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>

                {/* Google Preview simulation Card */}
                <div style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "1.25rem", marginTop: "1rem" }}>
                  <div style={{ fontSize: "0.75rem", color: "#202124", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Globe size={12} /> https://tusitio.com/blog/{formData.slug || "slug"}
                  </div>
                  <div style={{ fontSize: "1.2rem", color: "#1a0dab", textDecoration: "none", cursor: "pointer", fontFamily: "sans-serif", marginBottom: "0.25rem" }}>
                    {formData.seoTitle || formData.title || "Título SEO simulado"}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#4d5156", fontFamily: "sans-serif", lineHeight: "1.4" }}>
                    {formData.seoDescription || "Introduce una meta descripción para ver cómo lucirá este post en los resultados de búsqueda de Google."}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Options & Image Upload Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Status Settings Card */}
          <div style={{ ...cardStyle, padding: "1.5rem" }}>
            <h4 style={{ margin: "0 0 1rem 0", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
              Publicación
            </h4>
            
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", marginBottom: "1rem" }}>
              <input
                type="checkbox"
                name="published"
                id="published"
                checked={formData.published}
                onChange={handleChange}
                style={{ width: "1.25rem", height: "1.25rem", accentColor: "var(--color-accent)", cursor: "pointer" }}
              />
              <label htmlFor="published" style={{ fontWeight: 600, fontSize: "0.95rem", cursor: "pointer", color: "var(--text-main)" }}>
                Publicar post
              </label>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Button type="submit" disabled={isSubmitting || isUploading} style={{ width: "100%", padding: "0.85rem" }}>
                {isSubmitting || isUploading ? "Guardando..." : "Guardar Cambios"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} style={{ width: "100%" }}>
                Cancelar
              </Button>
            </div>
          </div>

          {/* Cover Image Upload Card */}
          <div style={{ ...cardStyle, padding: "1.5rem" }}>
            <h4 style={{ margin: "0 0 1rem 0", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
              Imagen de Portada
            </h4>

            {!imagePreview ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    const file = e.dataTransfer.files[0];
                    const validTypes = ["image/jpeg", "image/png", "image/webp"];
                    if (file.size > 5 * 1024 * 1024) {
                      toast.error("El archivo supera los 5MB.");
                      return;
                    }
                    if (!validTypes.includes(file.type)) {
                      toast.error("Formato no soportado.");
                      return;
                    }
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
                onClick={() => document.getElementById("post-image-upload")?.click()}
                style={{
                  border: `2px dashed ${isDragging ? "var(--color-accent)" : "rgba(0,0,0,0.15)"}`,
                  borderRadius: "12px",
                  padding: "2rem 1rem",
                  textAlign: "center",
                  backgroundColor: isDragging ? "rgba(212, 164, 55, 0.05)" : "rgba(0,0,0,0.01)",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <ImageIcon size={32} style={{ color: "var(--text-muted)", opacity: 0.6 }} />
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)" }}>Subir Imagen</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Max 5MB</span>
                <input
                  id="post-image-upload"
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>
            ) : (
              <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }} />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    backgroundColor: "rgba(220, 38, 38, 0.85)",
                    border: "none",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </form>
  );
};
