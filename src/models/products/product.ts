import { Lookup } from "@root/models/lookup/lookup";

export interface Product {
  id: number;
  productId: string;
  name: string;
  description: string;
  longDescription: string;
  brand: string;
  category: Lookup;
  price: number;
  stockQuantity: number;
  createdAt?: string;
  updatedAt?: string;
}
