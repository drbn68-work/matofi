
import { Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/lib/types";
import { UserInfo } from "./types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CartOrderConfirmationProps {
  items: CartItem[];
  userInfo: UserInfo;
  deliveryLocation: string;
  comments: string;
}

export const CartOrderConfirmation = ({ 
  items, 
  userInfo, 
  deliveryLocation, 
  comments 
}: CartOrderConfirmationProps) => (
  <ScrollArea className="h-[calc(100vh-10rem)]">
    <div className="space-y-6 pr-4">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Comanda Realitzada</h2>
        <p className="text-gray-600 mb-6">La seva comanda ha estat enviada correctament</p>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <div>
          <h3 className="font-medium mb-2">Informació del sol·licitant</h3>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Centre de cost:</span>
              <span>{userInfo.costCenter} {userInfo.department}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Demanat per:</span>
              <span>{userInfo.fullName}</span>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-medium mb-2">Detalls de l'entrega</h3>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Lloc de lliurament:</span>
              <span>{deliveryLocation}</span>
            </div>
            {comments && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Comentaris:</span>
                <span>{comments}</span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-medium mb-2">Articles sol·licitats</h3>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3 text-sm">
                <div className="h-4 w-4 border rounded-sm flex-shrink-0" />
                <div className="flex justify-between w-full">
                  <span>{item.product.name}</span>
                  <span className="text-gray-600">{item.quantity} unitats</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </ScrollArea>
);
