import { useState, useEffect } from "react";
import { getProducts, getCategories } from "@/lib/api"; // Asegúrate de que getProducts reciba (page, pageSize, search, category)
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

// -- FUNCIÓN PARA CALCULAR LAS PÁGINAS A MOSTRAR --
function getPagesToShow(currentPage: number, totalPages: number, maxVisible: number): number[] {
  const pages: number[] = [];
  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
  const half = Math.floor(maxVisible / 2);
  let start = currentPage - half;
  let end = currentPage + half;
  if (start < 1) {
    start = 1;
    end = maxVisible;
  }
  if (end > totalPages) {
    end = totalPages;
    start = totalPages - maxVisible + 1;
  }
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
}

interface IndexProps {
  user: User | null;
}

export default function Index({ user }: IndexProps) {
  const { toast } = useToast();

  // Estados para la búsqueda, carrito y categoría
  const [search, setSearch] = useState("");
  // Usamos null para indicar "sin filtro"
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Vista en grid o lista
  const [isGridView, setIsGridView] = useState(false);

  // Listado de productos y categorías
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // 1) Cargar las categorías al montar (sin agregar "Tots")
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

  // 2) Cargar productos de la página actual cuando cambian currentPage, search o selectedCategory
  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Si no hay categoría seleccionada, pasamos cadena vacía para no filtrar por ella
        const catParam = selectedCategory ? selectedCategory : "";
        const data = await getProducts(currentPage, ITEMS_PER_PAGE, search, catParam);
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
  }, [currentPage, search, selectedCategory, toast]);

  // 3) Cuando cambia la búsqueda o la categoría, volvemos a la página 1
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  // Lógica de logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // Funciones para el carrito
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

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.codsap !== productId));
  };

  const handleCheckout = () => {
    toast({
      title: "Sol·licitud enviada",
      description: "La teva sol·licitud ha estat enviada correctament!",
    });
    setCartItems([]);
  };

  // 4) Calculamos las páginas visibles (máx. 5)
  const pagesToShow = getPagesToShow(currentPage, totalPages, 5);

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
        onCategorySelect={setSelectedCategory}
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

        {/* Se muestran los productos recibidos del servidor */}
        <ProductGrid
          products={products}
          onAddToCart={handleAddToCart}
          isGridView={isGridView}
        />

        <Pagination
          currentPage={currentPage}
          pageCount={totalPages}
          pagesToShow={pagesToShow}
          onPageChange={setCurrentPage}
        />
      </main>
    </div>
  );
}
