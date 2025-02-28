// CartCounter.tsx (recomendado)
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";

interface CartCounterProps {
  itemCount: number;
}

// Usamos un <span> con estilos en vez de <Button>
export const CartCounter = ({ itemCount }: CartCounterProps) => (
  <span className="relative inline-flex items-center justify-center 
                   h-10 w-10 border border-gray-300 rounded-md 
                   bg-white hover:bg-gray-100 text-gray-700">
    <ShoppingCart className="h-5 w-5" />
    {itemCount > 0 && (
      <Badge
        variant="destructive"
        className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0"
      >
        {itemCount}
      </Badge>
    )}
  </span>
);
