
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";

interface CartCounterProps {
  itemCount: number;
}

export const CartCounter = ({ itemCount }: CartCounterProps) => (
  <Button variant="outline" size="icon" className="relative">
    <ShoppingCart className="h-5 w-5" />
    {itemCount > 0 && (
      <Badge
        variant="destructive"
        className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0"
      >
        {itemCount}
      </Badge>
    )}
  </Button>
);
