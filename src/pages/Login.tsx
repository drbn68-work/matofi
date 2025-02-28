
import { LoginHeader } from "@/components/auth/LoginHeader";
import LoginForm from "@/components/auth/LoginForm";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Función para verificar la autenticación mediante cookies
const checkAuth = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/auth/check', { withCredentials: true });
    return response.data.authenticated;
  } catch (error) {
    console.error("Error al verificar autenticación:", error);
    return false;
  }
};

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Verificar si el usuario ya está autenticado al cargar la página
    const verifyAuth = async () => {
      const isAuthenticated = await checkAuth();
      if (isAuthenticated) {
        console.log("Login - Usuario ya autenticado, redirigiendo a /");
        navigate("/");
      }
      setIsLoading(false);
    };
    
    verifyAuth();
  }, [navigate]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-[450px] p-6 bg-white rounded shadow-sm">
        <LoginHeader />
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
