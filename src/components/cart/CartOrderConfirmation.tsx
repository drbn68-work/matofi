
import { Check, Printer } from "lucide-react";
import { CartItem } from "@/lib/types";
import { UserInfo } from "./types";
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
    <div className="h-[calc(100vh-2rem)] overflow-y-auto bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 no-print">
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

        <div>
          <h1 className="text-xl font-semibold mb-4 text-center print-only">Sol·licitud de Material ({items.length} articles)</h1>
          
          <table className="w-full">
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

            <thead>
              <tr>
                <th colSpan={2} className="pt-6 pb-4 text-left font-medium text-lg">Detalls de l'entrega</th>
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

            <thead>
              <tr>
                <th colSpan={2} className="pt-6 pb-4 text-left font-medium text-lg">Articles sol·licitats</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.product.id}>
                  <td className="py-2">{item.product.name}</td>
                  <td className="py-2 text-right text-gray-600">{item.quantity} unitats</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
