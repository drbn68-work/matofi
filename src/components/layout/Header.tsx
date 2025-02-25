
import { User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { CartPreview } from "@/components/CartPreview";
import { CartItem } from "@/lib/types";

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  cartItems: CartItem[];
  onRemoveFromCart: (productId: string) => void;
  onCheckout: () => void;
  onUpdateCartQuantity: (productId: string, quantity: number) => void;
}

export const Header = ({
  user,
  onLogout,
  searchValue,
  onSearchChange,
  cartItems,
  onRemoveFromCart,
  onCheckout,
  onUpdateCartQuantity
}: HeaderProps) => {
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
          <SearchBar value={searchValue} onChange={onSearchChange} />
          <CartPreview
            items={cartItems}
            onRemove={onRemoveFromCart}
            onCheckout={onCheckout}
            onUpdateQuantity={onUpdateCartQuantity}
          />
          {user && (
            <Button variant="ghost" size="icon" onClick={onLogout} className="ml-2">
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
