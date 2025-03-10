import { useState, useEffect } from "react";
import { getProducts, getCategories } from "@/lib/api"; // getProducts debe aceptar (page, pageSize, search, category)
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

  // Estados para búsqueda, carret y categoría
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Estados para campos adicionales
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

  // 1) Al montar, recuperar carret y campos adicionales de sessionStorage
  useEffect(() => {
    const storedCart = sessionStorage.getItem("cartItems");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
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

  // 5) Reiniciamos a página 1 cuando cambia la búsqueda o la categoría
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  // Lógica de logout: al hacer logout se borra el usuario y el carret de sessionStorage
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("cartItems");
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

  // Funciones para el carret: guardar en sessionStorage cada vez que se modifique
  const handleAddToCart = (product: Product, quantity: number) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.product.codsap === product.codsap);
      let newCart: CartItem[];
      if (existingItem) {
        newCart = prev.map((item) =>
          item.product.codsap === product.codsap
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCart = [...prev, { product, quantity }];
      }
      sessionStorage.setItem("cartItems", JSON.stringify(newCart));
      return newCart;
    });
    toast({
      title: "Material afegit",
      description: `${quantity} x ${product.descripcion}`,
      className: "bg-green-200 text-green-900",
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => {
      const newCart = prev.filter((item) => item.product.codsap !== productId);
      sessionStorage.setItem("cartItems", JSON.stringify(newCart));
      return newCart;
    });
  };

  const handleUpdateCartQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prev) => {
      const newCart = prev.map((item) =>
        item.product.codsap === productId ? { ...item, quantity: newQuantity } : item
      );
      sessionStorage.setItem("cartItems", JSON.stringify(newCart));
      return newCart;
    });
  };

  // Al "checkout" no limpiamos el carret para preservar la información durante la sesión
  const handleCheckout = () => {
    // No se elimina el carret
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
        cartItems={cartItems}
        onRemoveFromCart={handleRemoveFromCart}
        onCheckout={handleCheckout}
        onUpdateCartQuantity={handleUpdateCartQuantity}
        onCategorySelect={setSelectedCategory}
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
