
export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  image: string;
  price: number;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "completed";
  createdAt: Date;
}

export interface User {
  username: string;
  fullName: string;
  costCenter: string;
  department: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  costCenter: string;
}
