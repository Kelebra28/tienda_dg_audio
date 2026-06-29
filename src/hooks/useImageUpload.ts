import { useState } from 'react';
import toast from 'react-hot-toast';

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    setError(null);

    try {
      // 1. Validar tamaño en el frontend (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("El archivo excede los 5MB permitidos");
      }

      // 2. Validar formato
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        throw new Error("Formato no soportado. Solo JPG, PNG o WEBP.");
      }

      // 3. Preparar el FormData
      const formData = new FormData();
      formData.append("file", file);

      // 4. Enviar al endpoint para procesamiento con Sharp
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al procesar la imagen");
      }

      // 5. Retornar la cadena Base64
      return data.base64;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading, error };
};
