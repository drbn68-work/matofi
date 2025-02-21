
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
              {items.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sol·licitud de Material</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Información del solicitante */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-4 font-semibold">Informació sol·licitant</h3>
            <div className="space-y-2 text-sm">
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
          <ScrollArea className="h-[200px] pr-4">
            {items.map((item) => (
              <div key={item.product.id} className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">
                      Quantitat: {item.quantity}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(item.product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Separator className="mt-4" />
              </div>
            ))}
          </ScrollArea>

          {/* Campos de entrega y comentarios */}
          <div className="space-y-4">
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
            className="w-full"
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
