import { User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { CartPreview } from "@/components/CartPreview";
import { CartItem } from "@/lib/types";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  cartItems: CartItem[];
  onRemoveFromCart: (productId: string) => void;
  onCheckout: () => void;
  onUpdateCartQuantity: (productId: string, quantity: number) => void;
  onCategorySelect: (category: string | null) => void;
}

export const Header = ({
  user,
  onLogout,
  searchValue,
  onSearchChange,
  cartItems,
  onRemoveFromCart,
  onCheckout,
  onUpdateCartQuantity,
  onCategorySelect,
}: HeaderProps) => {
  const navigate = useNavigate();

  // Manejador local para cambios en la barra de búsqueda
  const handleSearchChange = (value: string) => {
    onSearchChange(value);
    // Cada vez que cambie la búsqueda, reseteamos la categoría
    onCategorySelect(null);
  };

  // Manejador para ir al historial de pedidos
  const handleViewOrdersHistory = () => {
    navigate("/orders-history");
  };

  return (
    <header className="fixed top-0 z-10 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-6">
          <img
            src="/lovable-uploads/70d83c98-5a0d-49cd-854d-2029b792990b.png"
            alt="Fundació Puigvert"
            className="h-12"
          />
          {user && (
            <div className="hidden sm:block">
              <span className="text-sm font-medium text-gray-700">
                {user.fullName}
              </span>
            </div>
          )}
        </div>

        <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-primary">
          Material d'Oficina
        </h1>

        <div className="flex items-center gap-4">
          <SearchBar value={searchValue} onChange={handleSearchChange} />
          <CartPreview
            items={cartItems}
            userInfo={user}
            onRemove={onRemoveFromCart}
            onCheckout={onCheckout}
            onUpdateQuantity={onUpdateCartQuantity}
          />
          {user && (
            <>
              {/* Botón para ver historial, con estilo outline y tamaño pequeño */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewOrdersHistory}
                className="hidden sm:inline-flex ml-2"
              >
                Historial Pedidos
              </Button>

              <Button variant="ghost" size="icon" onClick={onLogout} className="ml-2">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
