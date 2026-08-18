import React, { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { AlertCircle, ArrowUpCircle, CheckCircle, HelpCircle, XCircle } from "lucide-react";

interface ImportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (imageAction: "keep" | "replace") => void;
  summary: {
    newCount: number;
    modifiedCount: number;
    unmodifiedCount: number;
    imageConflictsCount: number;
  };
  isImporting: boolean;
}

export const ImportPreviewModal = ({ isOpen, onClose, onConfirm, summary, isImporting }: ImportPreviewModalProps) => {
  const [imageAction, setImageAction] = useState<"keep" | "replace">("keep");

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem"
      }}
    >
      <div 
        style={{
          width: "100%",
          maxWidth: "520px",
          backgroundColor: "var(--bg-primary)",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: "16px",
          boxShadow: "0 20px 40px -15px rgba(0,0,0,0.15)",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.35rem", color: "var(--text-main)", fontWeight: 700 }}>
              Previsualización de Importación
            </h3>
            <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Analizando el archivo de productos CSV
            </p>
          </div>
          <button 
            onClick={onClose} 
            disabled={isImporting}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
          >
            <XCircle size={20} />
          </button>
        </div>

        {/* Summary Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          
          {/* New products */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.85rem", borderRadius: "10px", backgroundColor: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.1)" }}>
            <CheckCircle size={20} style={{ color: "#10b981" }} />
            <div>
              <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#10b981" }}>{summary.newCount}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Productos Nuevos</div>
            </div>
          </div>

          {/* Modified products */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.85rem", borderRadius: "10px", backgroundColor: "rgba(212, 164, 55, 0.05)", border: "1px solid rgba(212, 164, 55, 0.1)" }}>
            <ArrowUpCircle size={20} style={{ color: "var(--color-accent)" }} />
            <div>
              <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--color-accent)" }}>{summary.modifiedCount}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Modificados (Se actualizarán)</div>
            </div>
          </div>

        </div>

        {/* Unmodified products indicator */}
        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", gap: "0.5rem", alignItems: "center", padding: "0.5rem 0.75rem", borderRadius: "8px", backgroundColor: "var(--bg-secondary)" }}>
          <AlertCircle size={14} />
          <span>{summary.unmodifiedCount} productos no tienen cambios y serán omitidos de la importación.</span>
        </div>

        {/* Image Conflict Section */}
        {summary.imageConflictsCount > 0 && (
          <div 
            style={{ 
              border: "1px solid rgba(212, 164, 55, 0.2)", 
              borderRadius: "12px", 
              padding: "1.25rem", 
              backgroundColor: "rgba(212, 164, 55, 0.02)",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem"
            }}
          >
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", color: "var(--color-accent)", fontWeight: 600, fontSize: "0.95rem" }}>
              <HelpCircle size={18} />
              <span>Conflicto de Imágenes Detectado</span>
            </div>
            
            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
              Se encontraron {summary.imageConflictsCount} productos existentes que ya tienen imágenes cargadas, pero el CSV define una imagen diferente. ¿Qué deseas hacer?
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.25rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.88rem", cursor: "pointer", userSelect: "none" }}>
                <input
                  type="radio"
                  name="imageAction"
                  checked={imageAction === "keep"}
                  onChange={() => setImageAction("keep")}
                  style={{ accentColor: "var(--color-accent)", cursor: "pointer" }}
                />
                <span>Conservar imágenes actuales en la base de datos (Omitir CSV)</span>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.88rem", cursor: "pointer", userSelect: "none" }}>
                <input
                  type="radio"
                  name="imageAction"
                  checked={imageAction === "replace"}
                  onChange={() => setImageAction("replace")}
                  style={{ accentColor: "var(--color-accent)", cursor: "pointer" }}
                />
                <span>Reemplazar imágenes actuales con las del CSV</span>
              </label>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose} 
            disabled={isImporting}
            style={{ padding: "0.65rem 1.25rem" }}
          >
            Cancelar
          </Button>
          <Button 
            type="button" 
            onClick={() => onConfirm(imageAction)} 
            disabled={isImporting || (summary.newCount === 0 && summary.modifiedCount === 0)}
            style={{ padding: "0.65rem 1.25rem" }}
          >
            {isImporting ? "Procesando..." : "Confirmar e Importar"}
          </Button>
        </div>

      </div>
    </div>
  );
};
