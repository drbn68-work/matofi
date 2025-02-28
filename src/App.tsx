
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import OrderSummary from "@/pages/OrderSummary";
import { useEffect, useState } from "react";
import axios from "axios";

// Función para verificar la autenticación mediante cookies
const checkAuth = async () => {
  try {
    // Primero intentar con cookie
    const response = await axios.get('http://localhost:3000/api/auth/check', { 
      withCredentials: true,
      timeout: 3000 // Tiempo de espera reducido para evitar bloqueos
    });
    console.log("Verificación de autenticación por API:", response.data);
    return response.data.authenticated;
  } catch (error) {
    console.error("Error al verificar autenticación por API:", error);
    
    // Si falla, verificar si hay estado de autenticación en sessionStorage (modo desarrollo)
    const isAuthenticatedInSession = sessionStorage.getItem('is_authenticated') === 'true';
    console.log("Verificación de autenticación por sessionStorage:", isAuthenticatedInSession);
    return isAuthenticatedInSession;
  }
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const authStatus = await checkAuth();
        console.log("PrivateRoute - Estado de autenticación:", authStatus);
        setIsAuthenticated(authStatus);
      } catch (error) {
        console.error("Error en verificación de autenticación:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    verifyAuth();
  }, []);

  // Mientras verificamos la autenticación, mostramos un indicador de carga
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Cargando...</div>;
  }
  
  if (isAuthenticated === false) {
    console.log("PrivateRoute - Usuario no autenticado, redirigiendo a /login");
    return <Navigate to="/login" replace />;
  }
  
  console.log("PrivateRoute - Usuario autenticado, mostrando contenido protegido");
  return <>{children}</>;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const authStatus = await checkAuth();
        console.log("App - Estado de autenticación inicial:", authStatus);
        setIsAuthenticated(authStatus);
      } catch (error) {
        console.error("Error en verificación inicial de autenticación:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    verifyAuth();
    
    // Verificar periódicamente pero con un intervalo más prolongado
    const interval = setInterval(async () => {
      try {
        const authStatus = await checkAuth();
        if (authStatus !== isAuthenticated) {
          console.log("App - Actualización de estado de autenticación:", authStatus);
          setIsAuthenticated(authStatus);
        }
      } catch (error) {
        console.error("Error en verificación periódica de autenticación:", error);
      }
    }, 30000); // Verificar cada 30 segundos
    
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Mientras cargamos el estado de autenticación inicial, mostramos un indicador de carga
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Cargando...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <PrivateRoute>
                <Index />
              </PrivateRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Login />
            )
          } 
        />

        <Route
          path="/order-summary"
          element={
            <PrivateRoute>
              <OrderSummary />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
