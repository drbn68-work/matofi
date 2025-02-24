import { CartItem } from "@/lib/types";

interface CartReviewFormProps {
  items: CartItem[];
}

export const CartReviewForm = ({ items }: CartReviewFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.product.id} className="flex justify-between items-center">
            <div>
              <p className="font-medium">{item.product.descripcion}</p>
              <p className="text-sm text-gray-500">
                SAP: {item.product.codsap} | AS400: {item.product.codas400}
              </p>
            </div>
            <span className="font-medium">{item.quantity}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
