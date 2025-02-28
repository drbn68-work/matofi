
import React from "react";
import { CartOrderConfirmationProps } from "@/lib/types";

export const CartOrderConfirmation = ({ items, userInfo, deliveryLocation, comments }: CartOrderConfirmationProps) => {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h3 className="font-medium mb-2">Informació de l'usuari</h3>
        <p>{userInfo.fullName}</p>
        <p className="text-sm text-gray-500">{userInfo.department}</p>
        <p className="text-sm text-gray-500">Centre de cost: {userInfo.costCenter}</p>
        <p className="text-sm text-gray-500">{userInfo.email}</p>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h3 className="font-medium mb-2">Detalls d'entrega</h3>
        <p>Lloc de lliurament: {deliveryLocation}</p>
        {comments && <p className="text-sm text-gray-500 mt-2">Comentaris: {comments}</p>}
      </div>

      <div className="space-y-2">
        <h3 className="font-medium mb-2">Articles sol·licitats</h3>
        {items.map((item) => (
          <div key={item.product.codsap} className="flex justify-between items-center border-b pb-2">
            <div>
              <p className="font-medium">{item.product.descripcion}</p>
              <p className="text-sm text-gray-500">
                SAP: {item.product.codsap} | AS400: {item.product.codas400}
              </p>
              <p className="text-sm text-gray-500">
                Ubicación: {item.product.ubicacion}
              </p>
            </div>
            <span className="font-medium">{item.quantity} unitats</span>
          </div>
        ))}
      </div>
    </div>
  );
};
