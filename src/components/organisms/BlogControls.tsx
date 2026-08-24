"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import styles from "@/app/blog/BlogPage.module.css";

interface BlogControlsProps {
  categories: string[];
  currentCategory?: string;
  currentSort?: string;
}

const sortOptions = [
  { value: "desc", label: "Más Recientes" },
  { value: "asc", label: "Más Antiguos" },
  { value: "az", label: "Alfabético (A-Z)" },
  { value: "za", label: "Alfabético (Z-A)" },
];

export default function BlogControls({ categories, currentCategory, currentSort = "desc" }: BlogControlsProps) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentSortLabel = sortOptions.find((opt) => opt.value === currentSort)?.label || "Más Recientes";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const handleSortSelect = (val: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("sort", val);
    router.push(url.pathname + url.search);
    setIsDropdownOpen(false);
  };

  return (
    <div className={styles.controlsBar}>
      <div className={styles.categoriesWrapper}>
        <Link 
          href={`/blog?sort=${currentSort}`} 
          className={`${styles.categoryChip} ${!currentCategory ? styles.categoryChipActive : styles.categoryChipInactive}`}
        >
          Todos
        </Link>
        {categories.map(cat => (
          <Link 
            key={cat}
            href={`/blog?category=${encodeURIComponent(cat)}&sort=${currentSort}`}
            className={`${styles.categoryChip} ${currentCategory === cat ? styles.categoryChipActive : styles.categoryChipInactive}`}
          >
            {cat}
          </Link>
        ))}
      </div>

      <div className={styles.sortWrapper}>
        <span className={styles.sortLabel}>ORDENAR POR:</span>
        <div className={styles.customDropdownContainer} ref={dropdownRef}>
          <button 
            type="button" 
            className={styles.customDropdownButton}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {currentSortLabel}
            <ChevronDown size={16} className={`${styles.dropdownIcon} ${isDropdownOpen ? styles.dropdownIconOpen : ""}`} />
          </button>
          
          {isDropdownOpen && (
            <div className={styles.customDropdownMenu}>
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${styles.customDropdownItem} ${currentSort === opt.value ? styles.customDropdownItemActive : ""}`}
                  onClick={() => handleSortSelect(opt.value)}
                >
                  {opt.label}
                  {currentSort === opt.value && <Check size={14} className={styles.checkIcon} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
