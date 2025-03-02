
import { CartItem } from "@/lib/types";

// Ejemplo de definición actualizada de UserInfo
export interface UserInfo {
  username: string;
  fullName: string;
  department: string;
  costCenter: string;
  email: string;
}


export interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  updateQuantity: (productId: string, quantity: number) => void;
}
