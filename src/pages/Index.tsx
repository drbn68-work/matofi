
import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { ProductCard } from "@/components/ProductCard";
import { CartPreview } from "@/components/CartPreview";
import { products, categories } from "@/lib/data";
import { CartItem, Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [search, setSearch] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: Product, quantity: number) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name}`,
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleCheckout = () => {
    toast({
      title: "Order placed",
      description: "Your order has been placed successfully!",
    });
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 z-10 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold text-primary">Supply Hub</h1>
          <div className="flex items-center gap-4">
            <SearchBar value={search} onChange={setSearch} />
            <CartPreview
              items={cartItems}
              onRemove={handleRemoveFromCart}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </header>

      <main className="container pt-24">
        <div className="mb-8 flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
