import React from "react";
import { Edit, Trash2, Eye, EyeOff, ExternalLink, Image as ImageIcon, Calendar } from "lucide-react";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  slug: string;
  imageUrl?: string | null;
  published: boolean;
  createdAt: Date;
}

interface PostTableProps {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string, published: boolean) => void;
}

export const PostTable = ({ posts, onEdit, onDelete, onTogglePublish }: PostTableProps) => {
  if (posts.length === 0) {
    return (
      <div 
        style={{ 
          textAlign: "center", 
          padding: "5rem 2rem", 
          backgroundColor: "rgba(255, 255, 255, 0.75)", 
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(0, 0, 0, 0.06)",
          borderRadius: "16px",
          boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.05)"
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✍️</div>
        <h3 style={{ margin: "0 0 0.5rem 0", color: "var(--text-main)" }}>No hay artículos aún</h3>
        <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.95rem" }}>Comienza creando tu primera publicación para el blog.</p>
      </div>
    );
  }

  return (
    <div 
      style={{ 
        backgroundColor: "rgba(255, 255, 255, 0.75)", 
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(0, 0, 0, 0.06)",
        borderRadius: "16px",
        boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.05)",
        overflow: "hidden"
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.06)", backgroundColor: "rgba(0, 0, 0, 0.01)" }}>
              <th style={{ padding: "1.25rem 1.5rem", fontWeight: 600, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", width: "80px" }}>Portada</th>
              <th style={{ padding: "1.25rem 1.5rem", fontWeight: 600, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>Artículo</th>
              <th style={{ padding: "1.25rem 1.5rem", fontWeight: 600, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>Estado</th>
              <th style={{ padding: "1.25rem 1.5rem", fontWeight: 600, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>Publicación</th>
              <th style={{ padding: "1.25rem 1.5rem", fontWeight: 600, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", textAlign: "right" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => {
              const formattedDate = new Date(post.createdAt).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <tr 
                  key={post.id} 
                  style={{ 
                    borderBottom: "1px solid rgba(0, 0, 0, 0.04)",
                    transition: "background-color 0.2s ease"
                  }}
                  className="table-row-hover"
                >
                  {/* Image Column */}
                  <td style={{ padding: "1rem 1.5rem" }}>
                    {post.imageUrl ? (
                      <div style={{ width: "60px", height: "45px", borderRadius: "6px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={post.imageUrl} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ) : (
                      <div style={{ width: "60px", height: "45px", borderRadius: "6px", backgroundColor: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed rgba(0,0,0,0.12)" }}>
                        <ImageIcon size={16} style={{ color: "#9ca3af" }} />
                      </div>
                    )}
                  </td>

                  {/* Title Column */}
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div style={{ fontWeight: 600, color: "var(--text-main)", fontSize: "1.05rem", marginBottom: "0.25rem" }}>{post.title}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontFamily: "monospace" }}>/blog/{post.slug}</div>
                  </td>

                  {/* Status Column */}
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        padding: "0.3rem 0.6rem",
                        borderRadius: "8px",
                        backgroundColor: post.published ? "rgba(16, 185, 129, 0.08)" : "rgba(107, 114, 128, 0.08)",
                        color: post.published ? "#10b981" : "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.03em"
                      }}
                    >
                      {post.published ? (
                        <>
                          <Eye size={12} /> Publicado
                        </>
                      ) : (
                        <>
                          <EyeOff size={12} /> Borrador
                        </>
                      )}
                    </span>
                  </td>

                  {/* Date Column */}
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                      <Calendar size={14} />
                      {formattedDate}
                    </div>
                  </td>

                  {/* Actions Column */}
                  <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => onTogglePublish(post.id, !post.published)}
                        title={post.published ? "Cambiar a Borrador" : "Publicar"}
                        style={{
                          padding: "0.55rem",
                          borderRadius: "8px",
                          border: "1px solid rgba(0,0,0,0.06)",
                          backgroundColor: "white",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          color: "var(--text-muted)",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                          transition: "all 0.2s ease"
                        }}
                      >
                        {post.published ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      
                      {post.published && (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          title="Ver página pública"
                          style={{
                            padding: "0.55rem",
                            borderRadius: "8px",
                            border: "1px solid rgba(0,0,0,0.06)",
                            backgroundColor: "white",
                            display: "flex",
                            alignItems: "center",
                            color: "var(--text-muted)",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                            transition: "all 0.2s ease"
                          }}
                        >
                          <ExternalLink size={15} />
                        </Link>
                      )}
                      
                      <button
                        onClick={() => onEdit(post)}
                        title="Editar artículo"
                        style={{
                          padding: "0.55rem",
                          borderRadius: "8px",
                          border: "1px solid rgba(0,0,0,0.06)",
                          backgroundColor: "white",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          color: "var(--text-main)",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                          transition: "all 0.2s ease"
                        }}
                      >
                        <Edit size={15} />
                      </button>
                      
                      <button
                        onClick={() => {
                          if (confirm("¿Estás seguro de que deseas eliminar este artículo?")) {
                            onDelete(post.id);
                          }
                        }}
                        title="Eliminar artículo"
                        style={{
                          padding: "0.55rem",
                          borderRadius: "8px",
                          border: "1px solid rgba(220,38,38,0.12)",
                          backgroundColor: "rgba(220,38,38,0.02)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          color: "#dc2626",
                          transition: "all 0.2s ease"
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
