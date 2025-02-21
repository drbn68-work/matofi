
import { Product } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  compact?: boolean;
}

export const ProductCard = ({ product, onAddToCart, compact = false }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(0);

  if (compact) {
    return (
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <div className="flex items-center gap-4 p-4">
          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-grow">
            <h3 className="line-clamp-1 font-medium">{product.name}</h3>
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
              <span className="w-6 text-center text-sm">{quantity}</span>
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
      <CardHeader className="p-0">
        <div className="aspect-square w-full overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="line-clamp-1 text-lg">{product.name}</CardTitle>
        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
          {product.description}
        </p>
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
          <span className="w-8 text-center">{quantity}</span>
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
