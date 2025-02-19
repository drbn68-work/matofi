
export interface Product {
  id: string;
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
