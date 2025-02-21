
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
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface CartPreviewProps {
  items: CartItem[];
  onRemove: (productId: string) => void;
  onCheckout: () => void;
}

export const CartPreview = ({ items, onRemove, onCheckout }: CartPreviewProps) => {
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [comments, setComments] = useState("");
  const { toast } = useToast();

  // Calculamos el total de artículos
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  // Simulación de datos del usuario - En una implementación real vendrían del contexto de autenticación
  const userInfo = {
    fullName: "David Robson",
    department: "Servei d'Informàtica",
    costCenter: "5220"
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
    onCheckout();
  };

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
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sol·licitud de Material ({totalItems} articles)</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {/* Información del solicitante */}
          <div className="rounded-lg border p-3">
            <h3 className="mb-2 font-semibold">Informació sol·licitant</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Centre de cost:</span>
                <span className="font-medium">{userInfo.costCenter} {userInfo.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Demanat per:</span>
                <span className="font-medium">{userInfo.fullName}</span>
              </div>
            </div>
          </div>

          {/* Lista de items */}
          <div className="rounded-lg border">
            <ScrollArea className="h-[250px] rounded-md" type="always">
              <div className="p-2">
                {items.map((item) => (
                  <div key={item.product.id} className="py-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{item.product.name}</h3>
                        <p className="text-xs text-gray-600">
                          Quantitat: {item.quantity}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onRemove(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Separator className="mt-2" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Campos de entrega y comentarios */}
          <div className="space-y-3">
            <div className="space-y-2">
              <label htmlFor="delivery" className="text-sm font-medium">
                Lloc de lliurament *
              </label>
              <Input
                id="delivery"
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                placeholder="Introdueix el lloc de lliurament"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="comments" className="text-sm font-medium">
                Comentaris
              </label>
              <Input
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Comentaris opcionals"
              />
            </div>
          </div>

          <Button
            className="w-full mt-4"
            size="lg"
            onClick={handleSubmit}
            disabled={items.length === 0}
          >
            Enviar Sol·licitud
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
