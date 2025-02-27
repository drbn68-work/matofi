
export interface Product {
  id: string;
  codsap: string;
  codas400: string;
  descripcion: string;
  ubicacion: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  costCenter: string;
  authType: 'ldap' | 'local';
}

export interface LoginResponse {
  success: boolean;
  user?: {
    username: string;
    fullName: string;
    costCenter: string;
    department: string;
  };
  error?: string;
}
