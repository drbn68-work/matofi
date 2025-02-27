
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

export interface CartReviewFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

export interface CartOrderConfirmationProps {
  onClose: () => void;
  orderNumber: string;
}
