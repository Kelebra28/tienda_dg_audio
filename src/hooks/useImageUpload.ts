import { useState } from 'react';
import toast from 'react-hot-toast';
import imageCompression from 'browser-image-compression';

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    setError(null);

    try {
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("El archivo excede los 5MB permitidos");
      }

      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        throw new Error("Formato no soportado. Solo JPG, PNG o WEBP.");
      }

      // 1. Comprimir en el cliente usando browser-image-compression
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        fileType: "image/webp" as any
      };

      const compressedFile = await imageCompression(file, options);

      // 2. Convertir a cadena Base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });

      return base64;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido al procesar la imagen";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading, error };
};
