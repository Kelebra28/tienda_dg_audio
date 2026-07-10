export interface Product {
  id: string;
  name: string;
  description: string;
  priceWithoutIva: number;
  price: number;
  stock: number;
  category?: string | null;
  brand?: string | null;
  family?: string | null;
  subcategory?: string | null;
  model?: string | null;
  currency?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
