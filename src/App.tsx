
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import OrderSummary from "@/pages/OrderSummary";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem("user");
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  // Verificar si el usuario está autenticado
  const user = localStorage.getItem("user");

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
          element={user ? <Navigate to="/" replace /> : <Login />} 
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
