
export interface Product {
  id: string;
  codsap: string;
  codas400: string;
  descripcion: string;
  ubicacion: string;
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
  costCenter: string;
  authType: 'ldap' | 'local';
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export interface UserInfo {
  name: string;
  department: string;
  costCenter: string;
}

export interface CartReviewFormProps {
  items: CartItem[];
  userInfo: UserInfo;
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
  userInfo: UserInfo;
  deliveryLocation: string;
  comments: string;
}
