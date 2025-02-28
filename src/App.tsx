
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import OrderSummary from "@/pages/OrderSummary";
import { useEffect, useState } from "react";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  // Forzar la re-evaluación del estado de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  useEffect(() => {
    // Verificar la autenticación cuando el componente se monta o actualiza
    const user = localStorage.getItem("user");
    setIsAuthenticated(!!user);
    
    // Para debug
    console.log("PrivateRoute - Estado de autenticación:", !!user);
  }, []);

  if (!isAuthenticated) {
    console.log("PrivateRoute - Usuario no autenticado, redirigiendo a /login");
    return <Navigate to="/login" replace />;
  }
  
  console.log("PrivateRoute - Usuario autenticado, mostrando contenido protegido");
  return <>{children}</>;
};

function App() {
  // Verificar si el usuario está autenticado (para la ruta inicial)
  const [user, setUser] = useState<string | null>(null);
  
  useEffect(() => {
    // Cargar el estado de usuario del localStorage cuando el componente se monta
    const storedUser = localStorage.getItem("user");
    setUser(storedUser);
    
    // Para debug
    console.log("App - Usuario en localStorage:", !!storedUser);
    
    // Configuramos un evento para detectar cambios en el localStorage
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      console.log("App - Cambio detectado en localStorage:", !!updatedUser);
      setUser(updatedUser);
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    // También verificamos periódicamente el localStorage
    const interval = setInterval(() => {
      const currentUser = localStorage.getItem("user");
      if (currentUser !== user) {
        console.log("App - Actualización de usuario detectada:", !!currentUser);
        setUser(currentUser);
      }
    }, 1000);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* Redirigir la ruta raíz a /login si no está autenticado, o a / si lo está */}
        <Route 
          path="/" 
          element={
            user ? (
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
            user ? (
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
