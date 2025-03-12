// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import OrderSummary from "@/pages/OrderSummary";
import OrdersHistory from "@/pages/OrdersHistory";
import Tutorial from "@/pages/Tutorial";
import { Toaster } from "@/components/ui/toaster";
import UploadExcel from "@/components/UploadExcel";
import ExcelViewer from "@/components/ExcelViewer";
import { CartProvider } from "@/context/CartContext";

function PrivateRoute({ children, user }: { children: React.ReactNode; user: any }) {
  if (!user) {
    console.log("PrivateRoute - Usuari no autenticat, redirigint a /login");
    return <Navigate to="/login" replace />;
  }
  console.log("PrivateRoute - Usuari autenticat, mostrant contingut protegit");
  return <>{children}</>;
}

export default function App() {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    // Llegir de sessionStorage al muntar l'app
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Convertir la cadena JSON en un objecte
  const parsedUser = user ? JSON.parse(user) : null;

  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Ruta arrel: si l'usuari no està autenticat, es mostra Login */}
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

          {/* Ruta /login redirigeix a la ruta arrel */}
          <Route path="/login" element={<Navigate to="/" replace />} />

          {/* Ruta protegida per a OrderSummary */}
          <Route
            path="/order-summary"
            element={
              <PrivateRoute user={user}>
                <OrderSummary />
              </PrivateRoute>
            }
          />

          {/* Nova ruta per a l'historial de comandes */}
          <Route
            path="/orders-history"
            element={
              <PrivateRoute user={user}>
                <OrdersHistory />
              </PrivateRoute>
            }
          />

          {/* Nova ruta per al Tutorial / Manual d'usuari */}
          <Route
            path="/tutorial"
            element={
              <PrivateRoute user={user}>
                <Tutorial />
              </PrivateRoute>
            }
          />

          {/* Nova ruta per pujar Excel */}
          <Route
            path="/upload-excel"
            element={
              <PrivateRoute user={user}>
                <UploadExcel />
              </PrivateRoute>
            }
          />

          {/* Nova ruta per veure el catàleg */}
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
    </CartProvider>
  );
}
