export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category?: string | null;
  brand?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
