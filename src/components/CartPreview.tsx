
import { CartItem } from "@/lib/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CartCounter } from "./cart/CartCounter";
import { CartOrderConfirmation } from "./cart/CartOrderConfirmation";
import { CartReviewForm } from "./cart/CartReviewForm";
import { UserInfo } from "./cart/types";

interface CartPreviewProps {
  items: CartItem[];
  onRemove: (productId: string) => void;
  onCheckout: () => void;
}

export const CartPreview = ({ items, onRemove, onCheckout }: CartPreviewProps) => {
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [comments, setComments] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const userInfo: UserInfo = {
    fullName: "David Robson",
    department: "Servei d'Informàtica",
    costCenter: "5220",
    email: "drobson@fundacio-puigvert.es"
  };

  const handleSubmit = () => {
    if (!deliveryLocation.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El camp Lloc de Lliurament és obligatori",
      });
      return;
    }

    setIsSubmitted(true);
    onCheckout();
    
    toast({
      title: "Èxit",
      description: "Comanda realitzada correctament",
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <CartCounter itemCount={totalItems} />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sol·licitud de Material ({totalItems} articles)</SheetTitle>
        </SheetHeader>

        {isSubmitted ? (
          <CartOrderConfirmation
            items={items}
            userInfo={userInfo}
            deliveryLocation={deliveryLocation}
            comments={comments}
          />
        ) : (
          <CartReviewForm
            items={items}
            userInfo={userInfo}
            deliveryLocation={deliveryLocation}
            comments={comments}
            onRemove={onRemove}
            onSubmit={handleSubmit}
            onDeliveryLocationChange={setDeliveryLocation}
            onCommentsChange={setComments}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
