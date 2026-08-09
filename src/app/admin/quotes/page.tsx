"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ShoppingBag, X, Search, ChevronDown, CheckCircle, Clock } from "lucide-react";
import Image from "next/image";

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuote, setSelectedQuote] = useState<any | null>(null);
  
  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const res = await fetch("/api/quotes");
      const data = await res.json();
      if (Array.isArray(data)) {
        setQuotes(data);
      }
    } catch (error) {
      console.error("Error fetching quotes", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuoteStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/quotes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      fetchQuotes(); // reload
    } catch (error) {
      console.error("Error updating quote", error);
    }
  };

  const filteredQuotes = quotes.filter(q => 
    q.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    q.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatusBadge = ({ status }: { status: string }) => {
    if (status === "PENDING") {
      return (
        <span style={{ backgroundColor: "#fffbeb", color: "#d97706", padding: "0.25rem 0.75rem", borderRadius: "99px", fontSize: "0.875rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
          <Clock size={14} /> Pendiente
        </span>
      );
    }
    return (
      <span style={{ backgroundColor: "#ecfdf5", color: "#059669", padding: "0.25rem 0.75rem", borderRadius: "99px", fontSize: "0.875rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
        <CheckCircle size={14} /> Atendida
      </span>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ margin: 0, fontSize: "2rem", color: "#111827", fontWeight: 800 }}>Gestión de Cotizaciones</h1>
        
        <div style={{ position: "relative", width: "300px" }}>
          <input
            type="text"
            placeholder="Buscar por cliente o folio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "0.6rem 1rem 0.6rem 2.5rem",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              outline: "none"
            }}
          />
          <Search size={18} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
        </div>
      </div>

      {isLoading ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>Cargando cotizaciones...</div>
      ) : (
        <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              <tr>
                <th style={{ padding: "1rem 1.5rem", color: "#374151", fontWeight: 600 }}>Folio & Fecha</th>
                <th style={{ padding: "1rem 1.5rem", color: "#374151", fontWeight: 600 }}>Cliente</th>
                <th style={{ padding: "1rem 1.5rem", color: "#374151", fontWeight: 600 }}>Contacto</th>
                <th style={{ padding: "1rem 1.5rem", color: "#374151", fontWeight: 600 }}>Estatus</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "right", color: "#374151", fontWeight: 600 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotes.map((quote) => (
                <tr key={quote.id} style={{ borderBottom: "1px solid #e5e7eb", transition: "background-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div style={{ fontWeight: 600, color: "#111827", fontSize: "0.9rem" }}>#{quote.id.split('-')[0].toUpperCase()}</div>
                    <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                      {format(new Date(quote.createdAt), "dd MMM yyyy, HH:mm", { locale: es })}
                    </div>
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div style={{ fontWeight: 600, color: "#111827" }}>{quote.customerName}</div>
                    <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                      {quote.items.length} {quote.items.length === 1 ? 'artículo' : 'artículos'}
                    </div>
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div style={{ color: "#374151", fontSize: "0.9rem" }}>{quote.customerEmail}</div>
                    <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>{quote.customerPhone}</div>
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <select 
                      value={quote.status}
                      onChange={(e) => updateQuoteStatus(quote.id, e.target.value)}
                      style={{ padding: "0.25rem", borderRadius: "6px", border: "1px solid #d1d5db", backgroundColor: "white", fontSize: "0.85rem", cursor: "pointer", fontWeight: 500 }}
                    >
                      <option value="PENDING">Pendiente</option>
                      <option value="ATTENDED">Atendida</option>
                    </select>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                    <button 
                      onClick={() => setSelectedQuote(quote)}
                      style={{ padding: "0.5rem 1rem", backgroundColor: "#111827", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 500 }}
                    >
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))}
              {filteredQuotes.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}>
                    No se encontraron cotizaciones.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Quote Details Modal */}
      {selectedQuote && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ backgroundColor: "white", borderRadius: "16px", width: "100%", maxWidth: "700px", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>
            <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#111827" }}>Detalles de la Cotización</h2>
                <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>Folio: #{selectedQuote.id}</span>
              </div>
              <button onClick={() => setSelectedQuote(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ padding: "2rem", overflowY: "auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem", backgroundColor: "#f9fafb", padding: "1.5rem", borderRadius: "12px" }}>
                <div>
                  <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Cliente</div>
                  <div style={{ fontWeight: 600, color: "#111827" }}>{selectedQuote.customerName}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Contacto</div>
                  <div style={{ color: "#111827", marginBottom: "0.25rem" }}>{selectedQuote.customerEmail}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ color: "#111827" }}>{selectedQuote.customerPhone}</div>
                    <button 
                      onClick={() => {
                        const phone = selectedQuote.customerPhone.replace(/\D/g, '');
                        const message = encodeURIComponent(`Hola ${selectedQuote.customerName}, te contacto de DG Audio en seguimiento a tu solicitud de cotización (Folio #${selectedQuote.id.split('-')[0].toUpperCase()}).`);
                        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
                      }}
                      style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "0.25rem", 
                        padding: "0.25rem 0.5rem", 
                        backgroundColor: "#25D366", 
                        color: "white", 
                        border: "none", 
                        borderRadius: "4px", 
                        fontSize: "0.75rem", 
                        fontWeight: 600, 
                        cursor: "pointer" 
                      }}
                      title="Contactar por WhatsApp sin agregar a contactos"
                    >
                      <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                      Contactar
                    </button>
                  </div>
                </div>
                {selectedQuote.message && (
                  <div style={{ gridColumn: "1 / -1" }}>
                    <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Mensaje del cliente</div>
                    <div style={{ color: "#374151", backgroundColor: "white", padding: "1rem", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                      {selectedQuote.message}
                    </div>
                  </div>
                )}
              </div>

              <h3 style={{ fontSize: "1.1rem", color: "#111827", marginBottom: "1rem", fontWeight: 700 }}>Artículos Solicitados</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {selectedQuote.items.map((item: any) => (
                  <div key={item.id} style={{ display: "flex", gap: "1rem", padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "12px", alignItems: "center" }}>
                    <div style={{ width: "60px", height: "60px", borderRadius: "8px", backgroundColor: "#f3f4f6", overflow: "hidden", position: "relative", flexShrink: 0 }}>
                      {item.product.imageUrl ? (
                        <Image src={item.product.imageUrl} alt={item.product.name} fill style={{ objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
                          <ShoppingBag size={20} />
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: "#111827" }}>{item.product.name}</div>
                      <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>Modelo: {item.product.model || "N/A"}</div>
                    </div>
                    <div style={{ backgroundColor: "#f3f4f6", padding: "0.5rem 1rem", borderRadius: "8px", fontWeight: 600, color: "#374151" }}>
                      Cant: {item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ padding: "1.5rem 2rem", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setSelectedQuote(null)} style={{ padding: "0.75rem 1.5rem", backgroundColor: "white", border: "1px solid #d1d5db", color: "#374151", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
