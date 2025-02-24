
export interface Product {
  id: string;
  codsap: string;
  codas400: string;
  descripcion: string;
  ubicacion: string;
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

export interface LoginResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export interface CartOrderConfirmationProps {
  items: CartItem[];
  userInfo: UserInfo;
  deliveryLocation: string;
  comments: string;
}

export interface CartReviewFormProps {
  items: CartItem[];
  userInfo: UserInfo;
  deliveryLocation: string;
  comments: string;
  onRemove: (productId: string) => void;
  onSubmit: () => void;
  onDeliveryLocationChange: (value: string) => void;
  onCommentsChange: (value: string) => void;
}

export interface UserInfo {
  fullName: string;
  department: string;
  costCenter: string;
  email: string;
}
