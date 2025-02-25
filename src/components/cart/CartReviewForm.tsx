
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
  onUpdateQuantity
}: CartReviewFormProps) => {
  return (
    <div className="space-y-4 h-[calc(100vh-8rem)]">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Informació de l'usuari</h3>
        <p>{userInfo.fullName}</p>
        <p className="text-sm text-gray-500">{userInfo.department}</p>
        <p className="text-sm text-gray-500">Centre de cost: {userInfo.costCenter}</p>
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
        <ScrollArea className="h-[calc(100vh-32rem)] pr-4">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between items-start border-b pb-2">
                <div className="flex-grow">
                  <p className="font-medium">{item.product.descripcion}</p>
                  <p className="text-sm text-gray-500">
                    SAP: {item.product.codsap} | AS400: {item.product.codas400}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onUpdateQuantity?.(item.product.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onUpdateQuantity?.(item.product.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => onRemove(item.product.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <Button onClick={onSubmit} className="w-full" disabled={!deliveryLocation.trim()}>
        Confirmar sol·licitud
      </Button>
    </div>
  );
};
