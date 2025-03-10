import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import OrderSummary from "@/pages/OrderSummary";
import OrdersHistory from "@/pages/OrdersHistory"; // 🔹 Nueva ruta para el historial de pedidos
import { Toaster } from "@/components/ui/toaster";
import UploadExcel from "@/components/UploadExcel";  // 🔹 Nuevo componente para subir Excel
import ExcelViewer from "@/components/ExcelViewer";  // 🔹 Nuevo componente para ver el catálogo

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
  }, []);

  // Convertimos la cadena JSON en un objeto
  const parsedUser = user ? JSON.parse(user) : null;

  return (
    <Router>
      <Routes>
        {/* Ruta raíz: si el usuario no está autenticado, se muestra Login */}
        <Route
          path="/"
          element={
            user ? (
              <PrivateRoute user={user}>
                <Index user={parsedUser} />
              </PrivateRoute>
            ) : (
              <Login setUser={setUser} />
            )
          }
        />

        {/* Ruta /login redirige a la raíz */}
        <Route path="/login" element={<Navigate to="/" replace />} />

        {/* Ruta protegida para OrderSummary */}
        <Route
          path="/order-summary"
          element={
            <PrivateRoute user={user}>
              <OrderSummary />
            </PrivateRoute>
          }
        />

        {/* 🔹 Nueva ruta para ver el historial de pedidos */}
        <Route
          path="/orders-history"
          element={
            <PrivateRoute user={user}>
              <OrdersHistory />
            </PrivateRoute>
          }
        />

        {/* 🔹 Nueva ruta para subir Excel */}
        <Route
          path="/upload-excel"
          element={
            <PrivateRoute user={user}>
              <UploadExcel />
            </PrivateRoute>
          }
        />

        {/* 🔹 Nueva ruta para ver el catálogo de productos */}
        <Route
          path="/catalog"
          element={
            <PrivateRoute user={user}>
              <ExcelViewer />
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
