import axios from "axios";
import { Product, ProductResponse } from "../types/product";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const getProducts = async (
  skip: number,
  limit: number
): Promise<ProductResponse> => {
  const response = await axios.get<{ products: Product[]; total: number }>(
    `${API_BASE_URL}/products`,
    {
      params: { skip, limit },
    }
  );

  return {
    products: response.data.products,
    total: response.data.total, 
  };
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await axios.get<Product>(`${API_BASE_URL}/products/${id}`);
  return response.data;
};

export const searchProducts = async (query: string,skip: number, limit: number) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/products/search`,
      {
        params: { q: query, skip, limit },
      }
    );
    return {
      products: response.data.products || [],
      total: response.data.total,
    };
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

export const getProductsByCategory = async (
  category: string,
  skip: number,
  limit: number
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/products/category/${category}`,
      {
        params: { skip, limit },
      }
    );
    return {
      products: response.data.products || [],
      total: response.data.total,
    };
  } catch (error) {
    console.error("Error fetching category products:", error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/categories`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
