import { useState, useEffect } from "react";
import { getProducts, getCategories } from "@/lib/api"; // <- Asegúrate de que getProducts reciba (page, pageSize)
import { CartItem, Product, User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Toggle } from "@/components/ui/toggle";
import { LayoutGrid, LayoutList } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { CategoryFilter } from "@/components/products/CategoryFilter";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Pagination } from "@/components/products/Pagination";

// Definimos cuántos artículos traemos por página
const ITEMS_PER_PAGE = 8;

interface IndexProps {
  user: User | null;
}

export default function Index({ user }: IndexProps) {
  const { toast } = useToast();

  // Estados para la búsqueda, carrito, categoría
  const [search, setSearch] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Vista en grid o lista
  const [isGridView, setIsGridView] = useState(false);

  // Lista de productos de la página actual
  const [products, setProducts] = useState<Product[]>([]);

  // Lista de categorías
  const [categories, setCategories] = useState<string[]>([]);

  // 1) Cargar las categorías (opcional) al montar
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    loadCategories();
  }, []);

  // 2) Cargar productos de la página actual cuando cambie `currentPage`
  //    getProducts(currentPage, ITEMS_PER_PAGE) debería devolver algo como:
  //    { page, totalPages, items: [...], etc. }
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts(currentPage, ITEMS_PER_PAGE);
        setProducts(data.items);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No s'han pogut carregar les dades",
        });
      }
    };
    loadProducts();
  }, [currentPage, toast]);

  // 3) Cuando cambia la búsqueda o la categoría,
  //    volvemos a la página 1 (aunque el código aquí
  //    filtra localmente, no en servidor).
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  // Lógica de logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // 4) Filtro local aplicado sólo a los productos de esta página
  //    (Si quieres filtrar en el servidor, habría que pasar `search` o `selectedCategory` a getProducts)
  const filteredProducts = products.filter((product) => {
    if (!product.descripcion) return false;
    const matchesSearch = product.descripcion.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || product.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Añadir al carrito
  const handleAddToCart = (product: Product, quantity: number) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.product.codsap === product.codsap);
      if (existingItem) {
        return prev.map((item) =>
          item.product.codsap === product.codsap
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

  // Actualizar cantidad en el carrito
  const handleUpdateCartQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.codsap === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Quitar del carrito
  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.codsap !== productId));
  };

  // Checkout
  const handleCheckout = () => {
    toast({
      title: "Sol·licitud enviada",
      description: "La teva sol·licitud ha estat enviada correctament!",
    });
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con el search, carrito, etc. */}
      <Header
        user={user}
        onLogout={handleLogout}
        searchValue={search}
        onSearchChange={setSearch}
        cartItems={cartItems}
        onRemoveFromCart={handleRemoveFromCart}
        onCheckout={handleCheckout}
        onUpdateCartQuantity={handleUpdateCartQuantity}
      />

      {/* Contenido principal */}
      <main className="container pt-24">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
          <Toggle
            pressed={isGridView}
            onPressedChange={setIsGridView}
            aria-label="Canviar vista"
          >
            {isGridView ? <LayoutGrid className="h-4 w-4" /> : <LayoutList className="h-4 w-4" />}
          </Toggle>
        </div>

        {/* Renderizamos sólo los productos ya filtrados por search/categoría */}
        <ProductGrid
          products={filteredProducts}
          onAddToCart={handleAddToCart}
          isGridView={isGridView}
        />

        {/* Componente de paginación usando totalPages devuelto por el servidor */}
        <Pagination
          currentPage={currentPage}
          pageCount={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>
    </div>
  );
}
