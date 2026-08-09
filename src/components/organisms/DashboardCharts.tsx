"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from "recharts";

interface DashboardChartsProps {
  quotesByMonth: { month: string; total: number; attended: number }[];
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ quotesByMonth }) => {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem", marginBottom: "2rem" }}>
      <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", border: "1px solid #e5e7eb" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827", margin: "0 0 1.5rem 0" }}>
          Tendencia de Cotizaciones por Mes
        </h3>
        <div style={{ height: "350px", width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={quotesByMonth}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
              <Tooltip 
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="total" name="Total Recibidas" fill="#111827" radius={[4, 4, 0, 0]} />
              <Bar dataKey="attended" name="Atendidas" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
