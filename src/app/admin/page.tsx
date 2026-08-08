import prisma from "@/lib/prisma";
import { Package, Truck, CheckCircle, CreditCard, ShoppingBag, ShoppingCart } from "lucide-react";

export default async function AdminIndexPage() {
  // Consultas a la base de datos para obtener las métricas
  const totalProducts = await prisma.product.count();
  
  // Estadísticas de Cotizaciones
  const totalQuotes = await prisma.quote.count();
  const pendingQuotes = await prisma.quote.count({ where: { status: "PENDING" } });
  const paidQuotes = await prisma.quote.count({ where: { status: "PAID" } });
  const shippedQuotes = await prisma.quote.count({ where: { status: "SHIPPED" } });
  const deliveredQuotes = await prisma.quote.count({ where: { status: "DELIVERED" } });

  // Componente reutilizable para las tarjetas del Dashboard
  const StatCard = ({ title, value, icon, color = "var(--text-main)" }: { title: string, value: number, icon: React.ReactNode, color?: string }) => (
    <div style={{ backgroundColor: "var(--bg-primary)", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: "1rem" }}>
      <div style={{ padding: "1rem", backgroundColor: "var(--bg-secondary)", borderRadius: "8px", color: color }}>
        {icon}
      </div>
      <div>
        <h3 style={{ color: "var(--text-muted)", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0, paddingBottom: "0.25rem" }}>
          {title}
        </h3>
        <p style={{ fontSize: "2rem", fontWeight: 700, color: color, margin: 0 }}>
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="section-title" style={{ fontSize: "2rem", marginBottom: "2rem" }}>Dashboard General</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        {/* Quotes Summary */}
        <div style={{ backgroundColor: "var(--bg-primary)", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ padding: "0.75rem", backgroundColor: "var(--bg-secondary)", borderRadius: "8px", color: "var(--color-primary)" }}>
              <ShoppingCart size={24} />
            </div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", margin: 0 }}>Cotizaciones</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Total Registradas</span>
              <span style={{ fontWeight: "600", fontSize: "1.1rem" }}>{totalQuotes}</span>
            </div>
            <div style={{ height: "1px", backgroundColor: "#f0f0f0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Pendientes</span>
              <span style={{ fontWeight: "600", fontSize: "1.1rem", color: "#f59e0b" }}>{pendingQuotes}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Aprobadas (Pagadas)</span>
              <span style={{ fontWeight: "600", fontSize: "1.1rem", color: "#10b981" }}>{paidQuotes}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Enviadas</span>
              <span style={{ fontWeight: "600", fontSize: "1.1rem", color: "#3b82f6" }}>{shippedQuotes}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Entregadas</span>
              <span style={{ fontWeight: "600", fontSize: "1.1rem", color: "#6366f1" }}>{deliveredQuotes}</span>
            </div>
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--text-main)" }}>Métricas del Catálogo</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
        <div style={{ backgroundColor: "var(--bg-primary)", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <h3 style={{ color: "var(--text-muted)", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Total de Productos</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--text-main)", margin: 0 }}>{totalProducts}</p>
        </div>
      </div>
    </div>
  );
}
