// src/components/cart/CartReviewForm.tsx
import React, { FocusEvent } from "react";
import { CartReviewFormProps } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Minus } from "lucide-react";

// Importa la lista centralizada de centros de coste, con .value y .label
import { costCenters } from "@/constants/costCenters";

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
  onCostCenterChange,
}: CartReviewFormProps) => {
  /**
   * Busca si existe un centro cuyo .label coincida con el texto escrito.
   * Devuelve ese mismo label si existe; en caso contrario, cadena vacía.
   */
  const getCostCenterLabel = (typedLabel: string) => {
    const found = costCenters.find((cc) => cc.label === typedLabel);
    return found ? found.label : "";
  };

  /**
   * Al cambiar el input (mientras se teclea o se selecciona del datalist),
   * simplemente pasamos el valor sin validar. 
   */
  const handleCostCenterChange = (newValue: string) => {
    onCostCenterChange(newValue);
  };

  /**
   * Al hacer blur (cuando el usuario sale del campo), validamos:
   * - Si no coincide con ningún .label de la lista, lo limpiamos.
   * - Si sí coincide, lo dejamos.
   */
  const handleCostCenterBlur = (e: FocusEvent<HTMLInputElement>) => {
    const typedValue = e.target.value.trim();
    const validLabel = getCostCenterLabel(typedValue);
    if (!validLabel) {
      onCostCenterChange("");
      // Aquí podrías lanzar un toast de error si lo deseas
    } else {
      onCostCenterChange(validLabel);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto px-1">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Informació de l'usuari</h3>

          <p className="text-sm text-gray-700">
            <strong>Usuari (username):</strong> {userInfo.username}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Nom complet:</strong> {userInfo.fullName}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Departament:</strong> {userInfo.department}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Correu electrònic:</strong> {userInfo.email}
          </p>

          {/* Campo de Centre de cost (CAI Petició) con datalist basado en .label */}
          <div className="space-y-2 mt-2">
            <label htmlFor="costCenter" className="text-sm font-medium">
              Centre de cost (CAI Petició) *
            </label>
            <Input
              id="costCenter"
              type="text"
              list="costCenterList"
              value={userInfo.costCenter || ""}
              onChange={(e) => handleCostCenterChange(e.target.value)}
              onBlur={handleCostCenterBlur}
              placeholder="Introdueix o selecciona el centre de cost"
              required
            />
            <datalist id="costCenterList">
              {costCenters.map((cc) => (
                <option key={cc.value} value={cc.label}>
                  {cc.label}
                </option>
              ))}
            </datalist>
          </div>
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
              <div
                key={item.product.codsap}
                className="flex items-center justify-between py-2 border-b"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <p className="font-medium truncate">
                    {item.product.descripcion}
                  </p>
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
                      onClick={() =>
                        onUpdateQuantity(item.product.codsap, item.quantity - 1)
                      }
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    {/* Campo input para editar la cantidad manualmente */}
                    <input
                      type="number"
                      min="0"
                      value={item.quantity}
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value, 10);
                        if (!isNaN(newQuantity) && newQuantity >= 0) {
                          onUpdateQuantity(item.product.codsap, newQuantity);
                        }
                      }}
                      className="w-12 text-center border rounded text-sm"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() =>
                        onUpdateQuantity(item.product.codsap, item.quantity + 1)
                      }
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
        <Button
          onClick={onSubmit}
          className="w-full"
          disabled={!deliveryLocation.trim()}
        >
          Confirmar sol·licitud
        </Button>
      </div>
    </div>
  );
};
