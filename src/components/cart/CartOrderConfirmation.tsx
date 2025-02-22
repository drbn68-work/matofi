
import { Check, Printer, X, Square } from "lucide-react";
import { CartItem } from "@/lib/types";
import { UserInfo } from "./types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface CartOrderConfirmationProps {
  items: CartItem[];
  userInfo: UserInfo;
  deliveryLocation: string;
  comments: string;
  onClose?: () => void;
}

export const CartOrderConfirmation = ({ 
  items, 
  userInfo, 
  deliveryLocation, 
  comments,
  onClose 
}: CartOrderConfirmationProps) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center mb-8 no-print relative">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="absolute right-0 top-0"
          >
            <X className="h-6 w-6" />
          </Button>
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Comanda Realitzada</h2>
          <p className="text-gray-600 mb-4">La seva comanda ha estat enviada correctament</p>
          <Button 
            variant="outline" 
            onClick={handlePrint}
            className="mt-2"
          >
            <Printer className="mr-2" />
            Imprimir Confirmació
          </Button>
        </div>

        <div className="print-area">
          <h1 className="text-xl font-semibold mb-4 text-center">Sol·licitud de Material ({items.length} articles)</h1>
          
          <table className="w-full mb-8">
            <thead>
              <tr>
                <th colSpan={2} className="pb-4 text-left font-medium text-lg">Informació del sol·licitant</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 text-gray-600">Centre de cost:</td>
                <td className="py-2 text-right">{userInfo.costCenter} {userInfo.department}</td>
              </tr>
              <tr>
                <td className="py-2 text-gray-600">Demanat per:</td>
                <td className="py-2 text-right">{userInfo.fullName}</td>
              </tr>
            </tbody>
          </table>

          <Separator className="my-8 h-0.5 bg-gray-300" />

          <table className="w-full mb-8">
            <thead>
              <tr>
                <th colSpan={2} className="pb-4 text-left font-medium text-lg">Detalls de l'entrega</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 text-gray-600">Lloc de lliurament:</td>
                <td className="py-2 text-right">{deliveryLocation}</td>
              </tr>
              {comments && (
                <tr>
                  <td className="py-2 text-gray-600">Comentaris:</td>
                  <td className="py-2 text-right">{comments}</td>
                </tr>
              )}
            </tbody>
          </table>

          <Separator className="my-8 h-0.5 bg-gray-300" />

          <table className="w-full">
            <thead>
              <tr>
                <th colSpan={2} className="pb-4 text-left font-medium text-lg">Articles sol·licitats</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.product.id}>
                  <td className="py-2">{item.product.name}</td>
                  <td className="py-2 text-right flex items-center justify-end gap-2">
                    {item.quantity} unitats 
                    <Square className="h-5 w-5 text-gray-400" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
