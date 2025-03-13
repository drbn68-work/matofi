// src/components/CartPreview.tsx
import React, { useState, useEffect } from "react";
import { CartItem, User } from "@/lib/types";
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
import { useNavigate } from "react-router-dom";

interface CartPreviewProps {
  items: CartItem[];
  userInfo: User;
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

  // States for persisting fields
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [comments, setComments] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedItems, setSubmittedItems] = useState<CartItem[]>([]);

  // Local state for userInfo, adding department and costCenter with initial empty values if needed.
  // Now using the User interface instead of UserInfo.
  const [localUserInfo, setLocalUserInfo] = useState<User>({
    ...userInfo,
    department: userInfo.department || "",
    costCenter: "", // Set empty by default
    isAdmin: userInfo.isAdmin || false,
  });

  // Retrieve persisted data from sessionStorage on mount
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

    // Retrieve the department from sessionStorage
    const storedDepartment = sessionStorage.getItem("department");
    if (storedDepartment) {
      setLocalUserInfo((prev) => ({ ...prev, department: storedDepartment }));
    }
  }, []);

  // Listen for the "pageshow" event to reload costCenter and department if navigating back
  useEffect(() => {
    const handlePageShow = () => {
      const storedCostCenter = sessionStorage.getItem("costCenter");
      if (storedCostCenter) {
        setLocalUserInfo((prev) => ({ ...prev, costCenter: storedCostCenter }));
      }

      const storedDepartment = sessionStorage.getItem("department");
      if (storedDepartment) {
        setLocalUserInfo((prev) => ({ ...prev, department: storedDepartment }));
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  // Save to sessionStorage when costCenter, department, deliveryLocation, or comments change
  useEffect(() => {
    sessionStorage.setItem("costCenter", localUserInfo.costCenter);
  }, [localUserInfo.costCenter]);

  useEffect(() => {
    sessionStorage.setItem("department", localUserInfo.department);
  }, [localUserInfo.department]);

  useEffect(() => {
    sessionStorage.setItem("deliveryLocation", deliveryLocation);
  }, [deliveryLocation]);

  useEffect(() => {
    sessionStorage.setItem("comments", comments);
  }, [comments]);

  // Function to update costCenter (delegates validation to CartReviewForm)
  const handleCostCenterChange = (value: string) => {
    setLocalUserInfo((prev) => ({ ...prev, costCenter: value }));
  };

  const totalItems = isSubmitted
    ? submittedItems.reduce((acc, item) => acc + item.quantity, 0)
    : items.reduce((acc, item) => acc + item.quantity, 0);

  const handleSubmit = () => {
    if (!localUserInfo.costCenter.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El camp Centre de cost (CAI Petició) és obligatori",
      });
      return;
    }
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

  const handleClose = () => {
    setIsSubmitted(false);
  };

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
