// src/components/layout/HeaderSimple.tsx

import React from "react";
import { LogOut, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/types";
import { useCart } from "@/context/CartContext";    // <-- Importa el contexto del carrito
import { CartPreview } from "@/components/CartPreview"; // <-- Importa CartPreview

interface HeaderSimpleProps {
  user?: User | null;
  onLogout: () => void;
  onGoBack: () => void;
}

export function HeaderSimple({
  user,
  onLogout,
  onGoBack,
}: HeaderSimpleProps) {
  // Si no llega user por props, lo tomamos de sessionStorage (por si acaso)
  const storedUser = sessionStorage.getItem("user");
  const localUser: User | null = storedUser ? JSON.parse(storedUser) : null;
  const userToShow = user ?? localUser;

  // Obtenemos el carrito desde el contexto
  const { cartItems, removeFromCart, updateCartItem } = useCart();

  // Lógica local de logout (opcionalmente podrías llamar onLogout())
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("cartItems");
    sessionStorage.removeItem("deliveryLocation");
    sessionStorage.removeItem("comments");
    sessionStorage.removeItem("costCenter");
    sessionStorage.clear();
    // Llamada a la prop onLogout() si quieres que el padre haga algo extra:
    // onLogout();
    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  };

  // Lógica local para volver atrás (o llamar a onGoBack)
  const handleGoBackLocal = () => {
    // onGoBack();
    window.location.href = "/";
  };

  return (
    <header className="fixed top-0 z-10 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container flex items-center justify-between py-4">
        {/* Lado izquierdo: logo + nombre de usuario */}
        <div className="flex items-center gap-6">
          <img
            src="/lovable-uploads/70d83c98-5a0d-49cd-854d-2029b792990b.png"
            alt="Fundació Puigvert"
            className="h-12"
          />
          {userToShow && (
            <div className="hidden sm:block">
              <span className="text-sm font-medium text-gray-700">
                {userToShow.fullName}
              </span>
            </div>
          )}
        </div>

        {/* Título centrado */}
        <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-primary">
          Material d'Oficina
        </h1>

        {/* Lado derecho: carrito + botones */}
        <div className="flex items-center gap-4">
          {/* CartPreview (igual que en Header.tsx) */}
          <CartPreview
            items={cartItems}
            userInfo={userToShow}
            onRemove={removeFromCart}
            onCheckout={() => {}}
            onUpdateQuantity={updateCartItem}
          />

          {/* Botón "Tornar" */}
          <Button
            variant="ghost"
            onClick={handleGoBackLocal}
            className="ml-2 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Tornar a la selecció de productes
          </Button>

          {/* Botón "Logout" */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="ml-2"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
