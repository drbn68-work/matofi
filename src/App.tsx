import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import OrderSummary from "@/pages/OrderSummary";
import { Toaster } from "@/components/ui/toaster";

function PrivateRoute({ children, user }: { children: React.ReactNode; user: string | null }) {
  // Si no hay usuario, redirigir
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
    // Leer del localStorage sólo UNA VEZ al montar la app
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(storedUser);
    }

    // Si quieres detectar cambios de localStorage en OTRAS pestañas
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        const updatedUser = localStorage.getItem("user");
        setUser(updatedUser);
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Convertimos la string del localStorage en objeto para pasárselo a Index
  const parsedUser = user ? JSON.parse(user) : null;

  return (
    <Router>
      <Routes>
        {/* Ruta raíz protegida: si no hay user -> al login */}
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

        {/* Ruta /login: si YA hay user, redirige a "/", si no -> login */}
        <Route
          path="/login"
          element={
            user
              ? <Navigate to="/" replace />
              : <Login setUser={setUser} />
          }
        />

        {/* Otra ruta protegida */}
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
