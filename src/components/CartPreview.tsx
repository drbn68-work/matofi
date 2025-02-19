
import { CartItem } from "@/lib/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface CartPreviewProps {
  items: CartItem[];
  onRemove: (productId: string) => void;
  onCheckout: () => void;
}

export const CartPreview = ({ items, onRemove, onCheckout }: CartPreviewProps) => {
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {items.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0"
            >
              {items.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          {items.map((item) => (
            <div key={item.product.id} className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm font-medium">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(item.product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Separator className="mt-4" />
            </div>
          ))}
        </ScrollArea>
        <div className="mt-4">
          <div className="flex items-center justify-between py-4">
            <span className="text-lg font-medium">Total</span>
            <span className="text-lg font-bold">
              ${total.toFixed(2)}
            </span>
          </div>
          <Button
            className="w-full"
            size="lg"
            onClick={onCheckout}
            disabled={items.length === 0}
          >
            Checkout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
