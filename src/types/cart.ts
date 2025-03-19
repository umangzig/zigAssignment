import { Product } from "./product";


interface CartItem extends Product {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}