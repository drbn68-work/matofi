
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import { CartItem } from "@/lib/types";
import { UserInfo } from "./types";

interface CartReviewFormProps {
  items: CartItem[];
  userInfo: UserInfo;
  deliveryLocation: string;
  comments: string;
  onRemove: (productId: string) => void;
  onSubmit: () => void;
  onDeliveryLocationChange: (value: string) => void;
  onCommentsChange: (value: string) => void;
}

export const CartReviewForm = ({
  items,
  userInfo,
  deliveryLocation,
  comments,
  onRemove,
  onSubmit,
  onDeliveryLocationChange,
  onCommentsChange,
}: CartReviewFormProps) => (
  <div className="mt-4 space-y-4">
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

    <div className="space-y-3">
      <div className="space-y-2">
        <label htmlFor="delivery" className="text-sm font-medium">
          Lloc de lliurament *
        </label>
        <Input
          id="delivery"
          value={deliveryLocation}
          onChange={(e) => onDeliveryLocationChange(e.target.value)}
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
          onChange={(e) => onCommentsChange(e.target.value)}
          placeholder="Comentaris opcionals"
        />
      </div>
    </div>

    <Button
      className="w-full mt-4"
      size="lg"
      onClick={onSubmit}
      disabled={items.length === 0}
    >
      Enviar Sol·licitud
    </Button>
  </div>
);
