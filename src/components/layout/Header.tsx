import React from "react";
import { User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { CartPreview } from "@/components/CartPreview";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onCategorySelect: (category: string | null) => void;
}

const Header = ({
  user,
  onLogout,
  searchValue,
  onSearchChange,
  onCategorySelect,
}: HeaderProps) => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateCartItem } = useCart();

  const handleSearchChange = (value: string) => {
    onSearchChange(value);
    onCategorySelect(null);
  };

  const handleViewOrdersHistory = () => {
    navigate("/orders-history");
  };

  const handleViewTutorial = () => {
    navigate("/tutorial");
  };

  const handleViewUploadExcel = () => {
    navigate("/upload-excel");
  };

  return (
    <header className="fixed top-0 z-10 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container flex items-center justify-between py-4">
        {/* Left Section: Logo and User Name */}
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

        {/* Center Section: Title */}
        <div className="flex-1 text-center">
          <h1 className="text-2xl font-bold text-primary">
            Material d'Oficina
          </h1>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-4">
          <SearchBar value={searchValue} onChange={handleSearchChange} />
          <CartPreview
            items={cartItems}
            userInfo={user}
            onRemove={removeFromCart}
            onCheckout={() => {}}
            onUpdateQuantity={updateCartItem}
          />
          {user && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewOrdersHistory}
                className="hidden sm:inline-flex ml-2"
              >
                Historial
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewTutorial}
                className="hidden sm:inline-flex ml-2"
              >
                Tutorial
              </Button>
              {user.isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewUploadExcel}
                  className="hidden sm:inline-flex ml-2"
                >
                  Pujar Catàleg
                </Button>
              )}
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

export default Header;
