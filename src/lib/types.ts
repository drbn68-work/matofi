// Define la interfaz de Producto (ajústala según tus campos)
export interface Product {
  // Ejemplo de campos:
  codsap: string;
  codas400: string;
  descripcion: string;
  ubicacion: string;
  categoria: string;
}

// Interfaz de usuario
export interface User {
  username: string;
  fullName: string;
  costCenter: string;  // Campo para el centre de cost
  department: string;
  email: string;
  isAdmin: boolean;
}

// Item del carret
export interface CartItem {
  product: Product;
  quantity: number;
}

// Credenciales para login
export interface LoginCredentials {
  username: string;
  password: string;
  authType: 'ldap' | 'local';
}

// Respuesta del login
export interface LoginResponse {
  success: boolean;
  user?: User;
  error?: string;
}

// Props para el formulario de revisión del carret
export interface CartReviewFormProps {
  items: CartItem[];
  userInfo: User; // Ahora usamos nuestra interfaz User
  deliveryLocation: string;
  comments: string;
  onRemove: (productId: string) => void;
  onSubmit: () => void;
  onDeliveryLocationChange: React.Dispatch<React.SetStateAction<string>>;
  onCommentsChange: React.Dispatch<React.SetStateAction<string>>;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onCostCenterChange: (value: string) => void; // Nuevo callback para actualizar el centre de cost
}

// Props para la confirmación del pedido en el carret
export interface CartOrderConfirmationProps {
  onClose: () => void;
  orderNumber: string;
  items: CartItem[];
  userInfo: User; // Usamos nuestra interfaz User
  deliveryLocation: string;
  comments: string;
}


export interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  updateQuantity: (productId: string, quantity: number) => void;
}

