import prisma from "@/lib/prisma";
import { Package, Truck, CheckCircle, CreditCard, ShoppingBag } from "lucide-react";

export default async function AdminIndexPage() {
  // Consultas a la base de datos para obtener las métricas
  const totalProducts = await prisma.product.count();
  
  // Estadísticas de Órdenes
  const totalOrders = await prisma.order.count();
  const pendingOrders = await prisma.order.count({ where: { status: "PENDING" } });
  const paidOrders = await prisma.order.count({ where: { status: "PAID" } });
  const shippedOrders = await prisma.order.count({ where: { status: "SHIPPED" } });
  const deliveredOrders = await prisma.order.count({ where: { status: "DELIVERED" } });

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
        <StatCard 
          title="Órdenes Totales" 
          value={totalOrders} 
          icon={<ShoppingBag size={28} />} 
        />
        <StatCard 
          title="Pendientes de Pago" 
          value={pendingOrders} 
          icon={<CreditCard size={28} />} 
          color="#f59e0b" // Naranja/Ambar
        />
        <StatCard 
          title="Pagadas (Por Enviar)" 
          value={paidOrders} 
          icon={<Package size={28} />} 
          color="#3b82f6" // Azul
        />
        <StatCard 
          title="Órdenes Enviadas" 
          value={shippedOrders} 
          icon={<Truck size={28} />} 
          color="#8b5cf6" // Morado
        />
        <StatCard 
          title="Órdenes Entregadas" 
          value={deliveredOrders} 
          icon={<CheckCircle size={28} />} 
          color="#10b981" // Verde
        />
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
