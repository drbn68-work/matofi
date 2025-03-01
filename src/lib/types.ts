
export interface Product {
  codsap: string;
  codas400: string;
  descripcion: string;
  ubicacion: string;
  categoria: string;
}

export interface User {
  username: string;
  fullName: string;
  costCenter: string;
  department: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
  authType: 'ldap' | 'local';
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export interface CartReviewFormProps {
  items: CartItem[];
  userInfo: import('@/components/cart/types').UserInfo;
  deliveryLocation: string;
  comments: string;
  onRemove: (productId: string) => void;
  onSubmit: () => void;
  onDeliveryLocationChange: React.Dispatch<React.SetStateAction<string>>;
  onCommentsChange: React.Dispatch<React.SetStateAction<string>>;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export interface CartOrderConfirmationProps {
  onClose: () => void;
  orderNumber: string;
  items: CartItem[];
  userInfo: import('@/components/cart/types').UserInfo;
  deliveryLocation: string;
  comments: string;
}
