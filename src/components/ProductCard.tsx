import { Product } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  compact?: boolean;
}

export const ProductCard = ({ product, onAddToCart, compact = false }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(0);

  // Función para manejar la entrada manual de cantidad
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setQuantity(isNaN(val) ? 0 : val);
  };

  if (compact) {
    return (
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <div className="flex items-center gap-4 p-4">
          <div className="flex-grow">
            <div className="flex gap-2 mb-1">
              <Badge variant="secondary" className="text-xs">
                SAP: {product.codsap}
              </Badge>
              <Badge variant="outline" className="text-xs">
                AS400: {product.codas400}
              </Badge>
            </div>
            <h3 className="line-clamp-2 font-medium">
              {product.descripcion}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(0, quantity - 1))}
                className="h-7 w-7"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <input
                type="number"
                min="0"
                value={quantity}
                onChange={handleInputChange}
                className="w-12 text-center border rounded text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
                className="h-7 w-7"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <Button
              onClick={() => onAddToCart(product, quantity)}
              size="sm"
              className="transition-all hover:scale-105"
              disabled={quantity === 0}
            >
              Afegir
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-4">
        <div className="flex gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            SAP: {product.codsap}
          </Badge>
          <Badge variant="outline" className="text-xs">
            AS400: {product.codas400}
          </Badge>
        </div>
        <CardTitle className="line-clamp-2 text-lg mb-4">
          {product.descripcion}
        </CardTitle>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.max(0, quantity - 1))}
            className="h-8 w-8"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <input
            type="number"
            min="0"
            value={quantity}
            onChange={handleInputChange}
            className="w-12 text-center border rounded"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(quantity + 1)}
            className="h-8 w-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button
          onClick={() => onAddToCart(product, quantity)}
          className="transition-all hover:scale-105"
          disabled={quantity === 0}
        >
          Sol·licitar
        </Button>
      </CardFooter>
    </Card>
  );
};
