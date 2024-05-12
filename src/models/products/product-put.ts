export interface ProductPut {
  productId: string;
  name: string;
  description: string;
  brand: string;
  categoryId: number;
  price: number;
  stockQuantity: number;
}
