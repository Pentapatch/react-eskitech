import { Product } from "@root/models/products/product";
import { ProductPost } from "@root/models/products/product-post";
import { ProductPut } from "@root/models/products/product-put";
import { Products } from "@root/models/products/products";
import axios from "axios";

const serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS;
if (!serverAddress) throw new Error("Server address not set");

export const axiosInstance = axios.create({
  baseURL: `${serverAddress}/api`,
  withCredentials: false,
  headers: {},
});

export const getProducts = () =>
  axiosInstance
    .get<Products[]>("/Products", {
      headers: { "Content-Type": "application/json" },
    })
    .then(({ data }) => data)
    .catch((error) => {
      throw error;
    });

export const getProduct = (productId: number) =>
  axiosInstance
    .get<Product>(`/Products/${productId}`, {
      headers: { "Content-Type": "application/json" },
    })
    .then(({ data }) => data)
    .catch((error) => {
      throw error;
    });

export const createProduct = (product: ProductPost) =>
  axiosInstance
    .post<ProductPost>(`/Products`, product, {
      headers: { "Content-Type": "application/json" },
    })
    .then(({ data }) => data)
    .catch((error) => {
      throw error;
    });

export const updateProduct = (productId: number, product: ProductPut) =>
  axiosInstance
    .put<ProductPut>(`/Products/${productId}`, product, {
      headers: { "Content-Type": "application/json" },
    })
    .then(({ data }) => data)
    .catch((error) => {
      throw error;
    });

export const deleteProduct = (productId: number) =>
  axiosInstance
    .delete(`/Products/${productId}`, {
      headers: { "Content-Type": "application/json" },
    })
    .catch((error) => {
      throw error;
    });
