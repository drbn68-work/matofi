import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import OrderSummary from "@/pages/OrderSummary";
import { Toaster } from "@/components/ui/toaster";

function PrivateRoute({ children, user }: { children: React.ReactNode; user: any }) {
  if (!user) {
    console.log("PrivateRoute - Usuario no autenticado, redirigiendo a /login");
    return <Navigate to="/login" replace />;
  }
  console.log("PrivateRoute - Usuario autenticado, mostrando contenido protegido");
  return <>{children}</>;
}

export default function App() {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    // Leer del sessionStorage al montar la app
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(storedUser);
    }
    // No se necesita handleStorageChange, sessionStorage no emite eventos como localStorage
  }, []);

  // Convertimos la cadena JSON en un objeto
  const parsedUser = user ? JSON.parse(user) : null;

  return (
    <Router>
      <Routes>
        {/* Ruta raíz protegida: si hay usuario, muestra Index; de lo contrario, redirige a /login */}
        <Route
          path="/"
          element={
            user ? (
              <PrivateRoute user={user}>
                <Index user={parsedUser} />
              </PrivateRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Ruta /login: si ya hay usuario, redirige a /; de lo contrario, muestra Login */}
        <Route
          path="/login"
          element={
            user ? <Navigate to="/" replace /> : <Login setUser={setUser} />
          }
        />

        {/* Ruta protegida para OrderSummary */}
        <Route
          path="/order-summary"
          element={
            <PrivateRoute user={user}>
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
