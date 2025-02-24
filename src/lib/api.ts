
import { LoginCredentials, LoginResponse } from '@/lib/types';

const API_BASE_URL = 'http://localhost:3000/api'; // Ajusta esto a la URL de tu backend

export const loginWithLDAP = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  // En desarrollo, simular un login exitoso
  if (process.env.NODE_ENV === 'development') {
    return {
      success: true,
      user: {
        username: credentials.username,
        fullName: `Usuario de Prueba (${credentials.username})`,
        costCenter: credentials.costCenter,
        department: 'Departamento de Prueba'
      }
    };
  }

  // En producción, usar el backend real
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en la autenticación');
    }

    return await response.json();
  } catch (error) {
    console.error('Error during LDAP authentication:', error);
    throw error;
  }
};
