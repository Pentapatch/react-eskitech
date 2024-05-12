import { Lookup } from "@root/models/lookup/lookup";

export interface Products {
  id: number;
  name: string;
  description: string;
  price: number;
  productId: string;
  brand: string;
  stockQuantity: number;
  category: Lookup;
}
