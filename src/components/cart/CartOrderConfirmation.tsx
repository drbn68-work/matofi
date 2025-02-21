
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
    <div className="print:w-screen print:max-w-none print:m-0 print:p-0">
      <ScrollArea className="h-[calc(100vh-10rem)] print:h-auto">
        <div className="max-w-2xl mx-auto space-y-6 print:max-w-none print:w-full print:mx-0">
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

          <div className="rounded-lg border p-6 space-y-6 print:border-none print:p-0">
            <div>
              <h3 className="font-medium mb-4 print:text-lg">Informació del sol·licitant</h3>
              <div className="space-y-3 print:space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm print:text-base">
                  <span className="text-gray-600">Centre de cost:</span>
                  <span className="text-right">{userInfo.costCenter} {userInfo.department}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm print:text-base">
                  <span className="text-gray-600">Demanat per:</span>
                  <span className="text-right">{userInfo.fullName}</span>
                </div>
              </div>
            </div>

            <Separator className="print:my-6" />

            <div>
              <h3 className="font-medium mb-4 print:text-lg">Detalls de l'entrega</h3>
              <div className="space-y-3 print:space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm print:text-base">
                  <span className="text-gray-600">Lloc de lliurament:</span>
                  <span className="text-right">{deliveryLocation}</span>
                </div>
                {comments && (
                  <div className="grid grid-cols-2 gap-4 text-sm print:text-base">
                    <span className="text-gray-600">Comentaris:</span>
                    <span className="text-right">{comments}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator className="print:my-6" />

            <div>
              <h3 className="font-medium mb-4 print:text-lg">Articles sol·licitats</h3>
              <div className="space-y-3 print:space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="grid grid-cols-2 gap-4 text-sm print:text-base items-center">
                    <span>{item.product.name}</span>
                    <span className="text-right text-gray-600">{item.quantity} unitats</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
