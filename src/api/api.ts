import { Categories } from "@root/models/categories/categories";
import { CategoryPost } from "@root/models/categories/category-post";
import { CategoryPut } from "@root/models/categories/category-put";
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

export const getCategories = () =>
  axiosInstance
    .get<Categories[]>("/Categories", {
      headers: { "Content-Type": "application/json" },
    })
    .then(({ data }) => data)
    .catch((error) => {
      throw error;
    });

export const getCategory = (categoryId: number) =>
  axiosInstance
    .get<Categories>(`/Categories/${categoryId}`, {
      headers: { "Content-Type": "application/json" },
    })
    .then(({ data }) => data)
    .catch((error) => {
      throw error;
    });

export const createCategory = (category: CategoryPost) =>
  axiosInstance
    .post<CategoryPost>(`/Categories`, category, {
      headers: { "Content-Type": "application/json" },
    })
    .then(({ data }) => data)
    .catch((error) => {
      throw error;
    });

export const updateCategory = (categoryId: number, category: CategoryPut) =>
  axiosInstance
    .put<CategoryPut>(`/Categories/${categoryId}`, category, {
      headers: { "Content-Type": "application/json" },
    })
    .then(({ data }) => data)
    .catch((error) => {
      throw error;
    });

export const deleteCategory = (categoryId: number) =>
  axiosInstance
    .delete(`/Categories/${categoryId}`, {
      headers: { "Content-Type": "application/json" },
    })
    .catch((error) => {
      throw error;
    });
