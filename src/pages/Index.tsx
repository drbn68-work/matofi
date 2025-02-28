
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, getCategories } from "@/lib/data";
import { logout } from "@/lib/api";
import { CartItem, Product } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { LogOut, ShoppingCart, Search, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [search, setSearch] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar productos y categorías
    const loadData = async () => {
      try {
        const loadedProducts = await getProducts();
        setProducts(loadedProducts);
        
        const loadedCategories = getCategories(loadedProducts);
        setCategories(loadedCategories);
        
        // Inicializar quantities para todos los productos
        const initialQuantities: Record<string, number> = {};
        loadedProducts.forEach(product => {
          initialQuantities[product.id] = 0;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error('Error cargando datos:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No s'han pogut carregar les dades",
        });
      }
    };

    loadData();
    
    // Cargar información del usuario desde sessionStorage
    const storedUser = sessionStorage.getItem('auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error al analizar usuario almacenado:", e);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      // Limpiar sessionStorage
      sessionStorage.removeItem('auth_user');
      sessionStorage.removeItem('is_authenticated');
      
      // Redirigir a login
      navigate("/login");
    } catch (error) {
      console.error("Error en logout:", error);
      // En caso de error, intentar limpiar sessionStorage de todas formas
      sessionStorage.removeItem('auth_user');
      sessionStorage.removeItem('is_authenticated');
      navigate("/login");
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = search.trim() === '' || 
      product.descripcion.toLowerCase().includes(search.toLowerCase()) ||
      product.codsap.includes(search) ||
      product.codas400.includes(search);
    
    const matchesCategory = !selectedCategory || product.ubicacion === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleUpdateQuantity = (productId: string, change: number) => {
    setQuantities(prev => {
      const current = prev[productId] || 0;
      const newQuantity = Math.max(0, current + change);
      return { ...prev, [productId]: newQuantity };
    });
  };

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id];
    if (quantity <= 0) return;
    
    setCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return prev.map(item => 
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prev, { product, quantity }];
    });
    
    // Resetear la cantidad después de añadir al carrito
    setQuantities(prev => ({ ...prev, [product.id]: 0 }));
    
    toast({
      title: "Material afegit",
      description: `${quantity} x ${product.descripcion}`,
    });
  };

  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(prevCategory => prevCategory === category ? null : category);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 z-10 w-full border-b bg-white">
        <div className="container mx-auto flex items-center justify-between py-4">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/70d83c98-5a0d-49cd-854d-2029b792990b.png" 
              alt="Fundació Puigvert" 
              className="h-12 mr-4"
            />
            {user && (
              <span className="text-sm font-medium text-gray-700">
                {user.fullName || `Usuario de Prueba (${user.username})`}
              </span>
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-primary absolute left-1/2 transform -translate-x-1/2">
            Material d'Oficina
          </h1>
          
          <div className="flex items-center space-x-4">
            {/* Buscador */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cercar material..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm"
              />
            </div>
            
            {/* Carrito */}
            <div className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {getTotalCartItems() > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {getTotalCartItems()}
                  </span>
                )}
              </Button>
            </div>
            
            {/* Botón de cerrar sesión */}
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Categorías */}
      <div className="container mx-auto pt-24">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Button
            variant={!selectedCategory ? "default" : "outline"}
            className="rounded-full text-xs"
            onClick={() => setSelectedCategory(null)}
          >
            Tot
          </Button>
          
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="rounded-full text-xs"
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Lista de productos */}
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm"
            >
              <div className="flex-1">
                <div className="flex gap-2 mb-1">
                  <Badge variant="secondary" className="text-xs">
                    SAP: {product.codsap}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    AS400: {product.codas400}
                  </Badge>
                </div>
                <h3 className="text-sm font-medium">{product.descripcion}</h3>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleUpdateQuantity(product.id, -1)}
                    className="h-8 w-8"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-6 text-center">{quantities[product.id] || 0}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleUpdateQuantity(product.id, 1)}
                    className="h-8 w-8"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <Button
                  onClick={() => handleAddToCart(product)}
                  disabled={!quantities[product.id]}
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                >
                  Afegir
                </Button>
              </div>
            </div>
          ))}
          
          {filteredProducts.length === 0 && (
            <div className="flex justify-center py-10">
              <p className="text-gray-500">No s'han trobat productes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
