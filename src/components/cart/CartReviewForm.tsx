import React from "react";
import { CartReviewFormProps } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Minus } from "lucide-react";

export const CartReviewForm = ({
  items,
  userInfo,
  deliveryLocation,
  comments,
  onRemove,
  onSubmit,
  onDeliveryLocationChange,
  onCommentsChange,
  onUpdateQuantity,
  onCostCenterChange // Nuevo prop para cambiar el centre de cost
}: CartReviewFormProps) => {
  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto px-1">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Informació de l'usuari</h3>
          <p>{userInfo.fullName}</p>
          <p className="text-sm text-gray-500">{userInfo.department}</p>
          <div className="space-y-2">
            <label htmlFor="costCenter" className="text-sm font-medium">
              Centre de cost *
            </label>
            <Input
              id="costCenter"
              type="number"
              value={userInfo.costCenter || ""}
              onChange={(e) => onCostCenterChange(e.target.value)}
              placeholder="Introdueix el centre de cost"
              required
            />
          </div>
          <p className="text-sm text-gray-500">{userInfo.email}</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="deliveryLocation" className="text-sm font-medium">
              Lloc de lliurament *
            </label>
            <Input
              id="deliveryLocation"
              value={deliveryLocation}
              onChange={(e) => onDeliveryLocationChange(e.target.value)}
              placeholder="Indica on vols rebre el material"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="comments" className="text-sm font-medium">
              Comentaris
            </label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => onCommentsChange(e.target.value)}
              placeholder="Afegeix comentaris addicionals si ho necessites"
              className="min-h-[100px]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Articles sol·licitats</h3>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.product.codsap} className="flex items-center justify-between py-2 border-b">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="font-medium truncate">{item.product.descripcion}</p>
                  <p className="text-xs text-gray-500">
                    SAP: {item.product.codsap} | AS400: {item.product.codas400}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => onUpdateQuantity?.(item.product.codsap, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => onUpdateQuantity?.(item.product.codsap, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 h-6 text-xs px-2"
                    onClick={() => onRemove(item.product.codsap)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 border-t pt-4 bg-white">
        <Button onClick={onSubmit} className="w-full" disabled={!deliveryLocation.trim()}>
          Confirmar sol·licitud
        </Button>
      </div>
    </div>
  );
};
