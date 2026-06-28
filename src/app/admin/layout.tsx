"use client";

import React from "react";
import Link from "next/link";
import { LayoutDashboard, Package, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg-secondary)" }}>
      {/* Sidebar */}
      <aside style={{ 
        width: "260px", 
        backgroundColor: "var(--bg-dark)", 
        color: "var(--text-inverse)", 
        padding: "2rem 1rem",
        display: "flex",
        flexDirection: "column"
      }}>
        <div style={{ marginBottom: "2rem", paddingLeft: "1rem" }}>
          <h2 style={{ color: "var(--color-accent)", margin: 0 }}>DG ADMIN</h2>
        </div>
        
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
          <Link 
            href="/admin" 
            style={{ padding: "0.75rem 1rem", borderRadius: "8px", display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--text-inverse)" }}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link 
            href="/admin/products" 
            style={{ padding: "0.75rem 1rem", borderRadius: "8px", backgroundColor: "rgba(212, 164, 55, 0.1)", color: "var(--color-accent)", display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <Package size={20} />
            Productos
          </Link>
        </nav>

        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          style={{ padding: "0.75rem 1rem", display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--text-muted)", marginTop: "auto", background: "none", border: "none", cursor: "pointer", fontSize: "1rem", fontFamily: "var(--font-body)" }}
        >
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "2rem" }}>
        {children}
      </main>
    </div>
  );
}
