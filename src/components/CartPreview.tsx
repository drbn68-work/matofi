import React, { useState, useEffect } from "react";
import { CartItem } from "@/lib/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { CartCounter } from "./cart/CartCounter";
import { CartOrderConfirmation } from "./cart/CartOrderConfirmation";
import { CartReviewForm } from "./cart/CartReviewForm";
import { UserInfo } from "./cart/types";
import { useNavigate } from "react-router-dom";

interface CartPreviewProps {
  items: CartItem[];
  userInfo: UserInfo; // Información del usuario proveniente del LDAP (sin costCenter, o con costCenter vacío)
  onRemove: (productId: string) => void;
  onCheckout: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export const CartPreview = ({
  items,
  userInfo,
  onRemove,
  onCheckout,
  onUpdateQuantity,
}: CartPreviewProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // 1) Estados para los campos a persistir
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [comments, setComments] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedItems, setSubmittedItems] = useState<CartItem[]>([]);

  // 2) Estado local para userInfo, con costCenter inicial vacío
  const [localUserInfo, setLocalUserInfo] = useState<UserInfo>({
    ...userInfo,
    costCenter: "",
  });

  // 3) Al montar, recuperar costCenter, deliveryLocation y comments desde sessionStorage
  useEffect(() => {
    const storedCostCenter = sessionStorage.getItem("costCenter");
    if (storedCostCenter) {
      setLocalUserInfo((prev) => ({ ...prev, costCenter: storedCostCenter }));
    }

    const storedDelivery = sessionStorage.getItem("deliveryLocation");
    if (storedDelivery) {
      setDeliveryLocation(storedDelivery);
    }

    const storedComments = sessionStorage.getItem("comments");
    if (storedComments) {
      setComments(storedComments);
    }
  }, []);

  // 4) Guardar en sessionStorage cada vez que cambien
  useEffect(() => {
    sessionStorage.setItem("costCenter", localUserInfo.costCenter);
  }, [localUserInfo.costCenter]);

  useEffect(() => {
    sessionStorage.setItem("deliveryLocation", deliveryLocation);
  }, [deliveryLocation]);

  useEffect(() => {
    sessionStorage.setItem("comments", comments);
  }, [comments]);

  // Función para actualizar costCenter
  const handleCostCenterChange = (value: string) => {
    setLocalUserInfo((prev) => ({ ...prev, costCenter: value }));
  };

  // Cálculo de ítems totales
  const totalItems = isSubmitted
    ? submittedItems.reduce((acc, item) => acc + item.quantity, 0)
    : items.reduce((acc, item) => acc + item.quantity, 0);

  // Confirmar solicitud y navegar a OrderSummary
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

    navigate("/order-summary", {
      state: {
        items,
        userInfo: localUserInfo,
        deliveryLocation,
        comments,
      },
    });
  };

  // Función para cerrar la confirmación del pedido
  const handleClose = () => {
    setIsSubmitted(false);
  };

  // Generar un número de pedido único
  const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

  return (
    <Sheet>
      <SheetTrigger>
        <CartCounter itemCount={totalItems} />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            Sol·licitud de Material ({totalItems} articles)
          </SheetTitle>
        </SheetHeader>

        {isSubmitted ? (
          <CartOrderConfirmation
            onClose={handleClose}
            orderNumber={orderNumber}
            items={submittedItems}
            userInfo={localUserInfo}
            deliveryLocation={deliveryLocation}
            comments={comments}
          />
        ) : (
          <CartReviewForm
            items={items}
            userInfo={localUserInfo}
            deliveryLocation={deliveryLocation}
            comments={comments}
            onRemove={onRemove}
            onSubmit={handleSubmit}
            onDeliveryLocationChange={setDeliveryLocation}
            onCommentsChange={setComments}
            onUpdateQuantity={onUpdateQuantity}
            onCostCenterChange={handleCostCenterChange}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
