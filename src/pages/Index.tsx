// src/pages/Index.tsx
import { useState, useEffect } from "react";
import { getProducts, getCategories } from "@/lib/api"; // getProducts debe aceptar (page, pageSize, search, category)
import { Product, User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Toggle } from "@/components/ui/toggle";
import { LayoutGrid, LayoutList } from "lucide-react";
import Header from "@/components/layout/Header";
import { CategoryFilter } from "@/components/products/CategoryFilter";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Pagination } from "@/components/products/Pagination";
import { useCart } from "@/context/CartContext"; // <-- Importamos el contexto para el carrito

const ITEMS_PER_PAGE = 8;

function getPagesToShow(
  currentPage: number,
  totalPages: number,
  maxVisible: number
): number[] {
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

  // Usamos el contexto para el carrito (eliminamos el estado local)
  const { cartItems, addToCart, removeFromCart, updateCartItem } = useCart();

  // Estados para búsqueda y categoría
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Estados para campos adicionales (se guardan en sessionStorage como antes)
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [comments, setComments] = useState("");

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Vista en grid o lista
  const [isGridView, setIsGridView] = useState(false);

  // Listado de productos y categorías
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // 1) Al montar, recuperar deliveryLocation y comments (NO el carrito) de sessionStorage
  useEffect(() => {
    const storedDelivery = sessionStorage.getItem("deliveryLocation");
    if (storedDelivery) {
      setDeliveryLocation(storedDelivery);
    }
    const storedComments = sessionStorage.getItem("comments");
    if (storedComments) {
      setComments(storedComments);
    }
  }, []);

  // 2) Guardar cambios en deliveryLocation y comments en sessionStorage
  useEffect(() => {
    sessionStorage.setItem("deliveryLocation", deliveryLocation);
  }, [deliveryLocation]);

  useEffect(() => {
    sessionStorage.setItem("comments", comments);
  }, [comments]);

  // 3) Cargar las categorías al montar
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

  // 4) Cargar productos de la página actual cuando cambian currentPage, search o selectedCategory
  useEffect(() => {
    const loadProducts = async () => {
      try {
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

  // 5) Reiniciamos la página 1 cuando cambia la búsqueda o la categoría
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  // Lógica de logout: al hacer logout se borra el usuario y otros datos en sessionStorage
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("cartItems"); // Se puede eliminar, ya que el contexto lo maneja
    sessionStorage.removeItem("deliveryLocation");
    sessionStorage.removeItem("comments");
    sessionStorage.removeItem("costCenter");
    sessionStorage.clear();
    toast({
      title: "Sessió tancada",
      description: "Has tancat la sessió correctament",
      className: "bg-green-200 text-green-900",
    });

    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  };

  // Funciones para el carrito: ahora usamos las funciones del contexto
  const handleAddToCart = (product: Product, quantity: number) => {
    const existingItem = cartItems.find(
      (item) => item.product.codsap === product.codsap
    );
    if (existingItem) {
      updateCartItem(product.codsap, existingItem.quantity + quantity);
    } else {
      addToCart({ product, quantity });
    }
    toast({
      title: "Material afegit",
      description: `${quantity} x ${product.descripcion}`,
      className: "bg-green-200 text-green-900",
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    removeFromCart(productId);
  };

  const handleUpdateCartQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartItem(productId, newQuantity);
    }
  };

  // Al "checkout" no limpiamos el carrito para preservar la información durante la sesión
  const handleCheckout = () => {
    // ...
  };

  // Paginación: calcular páginas visibles (máx. 5)
  const pagesToShow = getPagesToShow(currentPage, totalPages, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        onLogout={handleLogout}
        searchValue={search}
        onSearchChange={setSearch}
        onCategorySelect={setSelectedCategory}
        // No pasamos cartItems ni funciones de carrito, pues el Header usará el contexto
      />

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
