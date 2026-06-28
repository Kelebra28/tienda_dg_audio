import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";
import { Phone, Mail, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className="footer-col brand-col">
          <Link href="/" className={styles.footerLogo}>
            <Image 
              src="/dg_logo@2x.webp" 
              alt="DG AUDIOSOUND Logo" 
              width={112} 
              height={112}
              className={styles.footerLogoImg}
            />
          </Link>
          <p className={styles.footerDesc}>
            Proveemos soluciones integrales de audio, video e iluminación premium para crear experiencias inolvidables en hogares y negocios.
          </p>
          <div className={styles.socialLinks}>
            <a href="https://www.facebook.com/dgaudiosound" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="https://www.instagram.com/dgaudiosound/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
            </a>
          </div>
        </div>
        
        <div className="footer-col">
          <h4 className={styles.footerTitle}>Navegación</h4>
          <ul className={styles.footerLinks}>
            <li><Link href="/">Inicio</Link></li>
            <li><Link href="/tienda">Tienda</Link></li>
            <li><Link href="/contacto">Contacto</Link></li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h4 className={styles.footerTitle}>Tienda</h4>
          <ul className={styles.footerLinks}>
            <li><Link href="/tienda">Todos los productos</Link></li>
            <li><Link href="/tienda/ofertas">Ofertas especiales</Link></li>
            <li><Link href="/carrito">Mi carrito</Link></li>
            <li><Link href="/admin">Administración</Link></li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h4 className={styles.footerTitle}>Contacto</h4>
          <ul className={styles.footerContact}>
            <li><Phone size={18} /> +52 55 3727 0177</li>
            <li><Mail size={18} /> contacto@dgaudiosound.com</li>
            <li><MapPin size={18} /> Ciudad de México, México</li>
          </ul>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <div className={`container ${styles.footerBottomContainer}`}>
          <p>© {new Date().getFullYear()} DG Audiosound. Todos los derechos reservados.</p>
          <div className={styles.footerLegal}>
            <Link href="/privacidad">Aviso de Privacidad</Link>
            <Link href="/terminos">Términos y Condiciones</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
