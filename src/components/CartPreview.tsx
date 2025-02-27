
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
import { useNavigate } from "react-router-dom";

interface CartPreviewProps {
  items: CartItem[];
  onRemove: (productId: string) => void;
  onCheckout: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export const CartPreview = ({ items, onRemove, onCheckout, onUpdateQuantity }: CartPreviewProps) => {
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [comments, setComments] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedItems, setSubmittedItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const totalItems = isSubmitted 
    ? submittedItems.reduce((acc, item) => acc + item.quantity, 0)
    : items.reduce((acc, item) => acc + item.quantity, 0);

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

    setSubmittedItems([...items]);
    setIsSubmitted(true);
    onCheckout();
    
    // Navegar a la página de resumen con los datos necesarios
    navigate("/order-summary", {
      state: {
        items,
        userInfo,
        deliveryLocation,
        comments
      }
    });
  };

  // Función para manejar el cierre de la confirmación del pedido
  const handleClose = () => {
    setIsSubmitted(false);
  };

  // Generamos un número de pedido único
  const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

  return (
    <Sheet>
      <SheetTrigger>
        <CartCounter itemCount={totalItems} />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sol·licitud de Material ({totalItems} articles)</SheetTitle>
        </SheetHeader>

        {isSubmitted ? (
          <CartOrderConfirmation
            onClose={handleClose}
            orderNumber={orderNumber}
            items={submittedItems}
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
            onUpdateQuantity={onUpdateQuantity}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
