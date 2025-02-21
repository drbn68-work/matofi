
import { Check, Printer } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/lib/types";
import { UserInfo } from "./types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

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
}: CartOrderConfirmationProps) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <ScrollArea className="h-[calc(100vh-10rem)]">
      <div className="space-y-6 pr-4 print:pr-0 print:w-full print:max-w-none">
        <div className="text-center print:mb-8">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center print:hidden">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Comanda Realitzada</h2>
          <p className="text-gray-600 mb-2">La seva comanda ha estat enviada correctament</p>
          <Button 
            variant="outline" 
            onClick={handlePrint}
            className="mt-2 print:hidden"
          >
            <Printer className="mr-2" />
            Imprimir Confirmació
          </Button>
        </div>

        <div className="rounded-lg border p-4 space-y-4 print:border-none print:p-0">
          <div>
            <h3 className="font-medium mb-2 print:text-lg">Informació del sol·licitant</h3>
            <div className="space-y-1 print:space-y-2">
              <div className="flex justify-between text-sm print:text-base">
                <span className="text-gray-600">Centre de cost:</span>
                <span>{userInfo.costCenter} {userInfo.department}</span>
              </div>
              <div className="flex justify-between text-sm print:text-base">
                <span className="text-gray-600">Demanat per:</span>
                <span>{userInfo.fullName}</span>
              </div>
            </div>
          </div>

          <Separator className="print:my-4" />

          <div>
            <h3 className="font-medium mb-2 print:text-lg">Detalls de l'entrega</h3>
            <div className="space-y-1 print:space-y-2">
              <div className="flex justify-between text-sm print:text-base">
                <span className="text-gray-600">Lloc de lliurament:</span>
                <span>{deliveryLocation}</span>
              </div>
              {comments && (
                <div className="flex justify-between text-sm print:text-base">
                  <span className="text-gray-600">Comentaris:</span>
                  <span>{comments}</span>
                </div>
              )}
            </div>
          </div>

          <Separator className="print:my-4" />

          <div>
            <h3 className="font-medium mb-2 print:text-lg">Articles sol·licitats</h3>
            <div className="space-y-2 print:space-y-3">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 text-sm print:text-base">
                  <div className="h-4 w-4 border rounded-sm flex-shrink-0 print:hidden" />
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
};
