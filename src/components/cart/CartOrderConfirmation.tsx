import React from "react";
import { CartOrderConfirmationProps } from "@/lib/types";

export const CartOrderConfirmation = ({ items }: CartOrderConfirmationProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.product.id} className="flex justify-between items-center">
            <div>
              <p className="font-medium">{item.product.descripcion}</p>
              <p className="text-sm text-gray-500">
                SAP: {item.product.codsap} | AS400: {item.product.codas400}
              </p>
              <p className="text-sm text-gray-500">
                Ubicación: {item.product.ubicacion}
              </p>
            </div>
            <span className="font-medium">{item.quantity}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
