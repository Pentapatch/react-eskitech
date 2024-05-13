export interface ProductPut {
  productId: string;
  name: string;
  description: string;
  longDescription: string;
  brand: string;
  categoryId: number;
  price: number;
  stockQuantity: number;
}
