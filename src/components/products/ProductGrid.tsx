
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/lib/types";

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
  isGridView: boolean;
}

export const ProductGrid = ({ products, onAddToCart, isGridView }: ProductGridProps) => {
  return (
    <div className={isGridView ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "flex flex-col gap-4"}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          compact={!isGridView}
        />
      ))}
    </div>
  );
};
