
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import OrderSummary from "@/pages/OrderSummary";
import { useEffect, useState } from "react";
import axios from "axios";

// Creamos una función para verificar la autenticación mediante cookies
const checkAuth = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/auth/check', { withCredentials: true });
    return response.data.authenticated;
  } catch (error) {
    console.error("Error al verificar autenticación:", error);
    return false;
  }
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth();
      setIsAuthenticated(authStatus);
      setIsLoading(false);
      console.log("PrivateRoute - Estado de autenticación:", authStatus);
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
      const authStatus = await checkAuth();
      setIsAuthenticated(authStatus);
      setIsLoading(false);
      console.log("App - Estado de autenticación inicial:", authStatus);
    };
    
    verifyAuth();
    
    // Verificar periódicamente pero con un intervalo más prolongado
    const interval = setInterval(async () => {
      const authStatus = await checkAuth();
      if (authStatus !== isAuthenticated) {
        console.log("App - Actualización de estado de autenticación:", authStatus);
        setIsAuthenticated(authStatus);
      }
    }, 30000); // Verificar cada 30 segundos
    
    return () => clearInterval(interval);
  }, []);

  // Mientras cargamos el estado de autenticación inicial, mostramos un indicador de carga
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Cargando...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Redirigir la ruta raíz a /login si no está autenticado, o a / si lo está */}
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

        {/* La ruta de login es pública pero redirige a / si ya está autenticado */}
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

        {/* Rutas protegidas */}
        <Route
          path="/order-summary"
          element={
            <PrivateRoute>
              <OrderSummary />
            </PrivateRoute>
          }
        />

        {/* Ruta 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
