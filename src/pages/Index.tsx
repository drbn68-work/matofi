
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";
import { ProductCard } from "@/components/ProductCard";
import { CartPreview } from "@/components/CartPreview";
import { getProducts, getCategories } from "@/lib/data";
import { CartItem, Product, User } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Toggle } from "@/components/ui/toggle";
import { LayoutGrid, LayoutList, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 8;

const Index = () => {
  const [search, setSearch] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isGridView, setIsGridView] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const loadedProducts = await getProducts();
        setProducts(loadedProducts);
        setCategories(getCategories(loadedProducts));
      } catch (error) {
        console.error('Error loading products:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No s'han pogut carregar els productes",
        });
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const filteredProducts = products.filter((product) => {
    if (!product?.descripcion) return false;
    
    const matchesSearch = product.descripcion
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || product.ubicacion === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const pageCount = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
      title: "Material afegit",
      description: `${quantity} x ${product.descripcion}`,
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleCheckout = () => {
    toast({
      title: "Sol·licitud enviada",
      description: "La teva sol·licitud ha estat enviada correctament!",
    });
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 z-10 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container flex items-center justify-between py-4">
          <img 
            src="/lovable-uploads/70d83c98-5a0d-49cd-854d-2029b792990b.png" 
            alt="Fundació Puigvert" 
            className="h-12"
          />
          <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-primary">
            Material d'Oficina
          </h1>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                  {user.fullName}
                </span>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
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
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(null)}
            >
              Tot
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
          <Toggle
            pressed={isGridView}
            onPressedChange={setIsGridView}
            aria-label="Canviar vista"
          >
            {isGridView ? <LayoutGrid className="h-4 w-4" /> : <LayoutList className="h-4 w-4" />}
          </Toggle>
        </div>

        <div className={isGridView ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "flex flex-col gap-4"}>
          {currentProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              compact={!isGridView}
            />
          ))}
        </div>

        {pageCount > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: pageCount }).map((_, index) => (
              <Badge
                key={index}
                variant={currentPage === index + 1 ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </Badge>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
