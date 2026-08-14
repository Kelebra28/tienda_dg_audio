"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { PostForm } from "@/components/organisms/PostForm";
import { PostTable } from "@/components/organisms/PostTable";
import { createPost, updatePost, deletePost, togglePublishPost } from "./actions";
import toast from "react-hot-toast";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  createdAt: Date;
}

interface BlogClientContainerProps {
  initialPosts: Post[];
}

export default function BlogClientContainer({ initialPosts }: BlogClientContainerProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenCreate = () => {
    setEditingPost(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (post: any) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingPost(null);
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    const loadingToast = toast.loading(editingPost ? "Actualizando artículo..." : "Creando artículo...");

    try {
      if (editingPost) {
        const result = await updatePost(editingPost.id, data);
        if (result.success && result.post) {
          toast.success("Artículo actualizado exitosamente", { id: loadingToast });
          setPosts((prev) =>
            prev.map((p) => (p.id === editingPost.id ? { ...p, ...result.post, createdAt: new Date(result.post.createdAt) } : p))
          );
          handleCancel();
        } else {
          toast.error(result.error || "No se pudo actualizar el artículo", { id: loadingToast });
        }
      } else {
        const result = await createPost(data);
        if (result.success && result.post) {
          toast.success("Artículo creado exitosamente", { id: loadingToast });
          setPosts((prev) => [{ ...result.post, createdAt: new Date(result.post.createdAt) } as any, ...prev]);
          handleCancel();
        } else {
          toast.error(result.error || "No se pudo crear el artículo", { id: loadingToast });
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Ocurrió un error inesperado", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const loadingToast = toast.loading("Eliminando artículo...");
    try {
      const result = await deletePost(id);
      if (result.success) {
        toast.success("Artículo eliminado exitosamente", { id: loadingToast });
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } else {
        toast.error(result.error || "No se pudo eliminar el artículo", { id: loadingToast });
      }
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error inesperado", { id: loadingToast });
    }
  };

  const handleTogglePublish = async (id: string, published: boolean) => {
    const loadingToast = toast.loading(published ? "Publicando artículo..." : "Cambiando a borrador...");
    try {
      const result = await togglePublishPost(id, published);
      if (result.success && result.post) {
        toast.success(published ? "Artículo publicado" : "Artículo cambiado a borrador", { id: loadingToast });
        setPosts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, published: result.post.published } : p))
        );
      } else {
        toast.error(result.error || "No se pudo actualizar el estado", { id: loadingToast });
      }
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error inesperado", { id: loadingToast });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "2rem" }}>Administrador de Blog</h1>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>Crea, edita y gestiona las publicaciones del blog.</p>
        </div>
        {!isFormOpen && (
          <Button onClick={handleOpenCreate} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Plus size={18} /> Nuevo Artículo
          </Button>
        )}
      </div>

      {isFormOpen ? (
        <div style={{ backgroundColor: "var(--bg-primary)", padding: "2rem", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.05)" }}>
          <h2 style={{ marginBottom: "1.5rem" }}>{editingPost ? "Editar Artículo" : "Crear Nuevo Artículo"}</h2>
          <PostForm
            initialData={editingPost || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </div>
      ) : (
        <PostTable
          posts={posts}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onTogglePublish={handleTogglePublish}
        />
      )}
    </div>
  );
}
