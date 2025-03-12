// src/context/CartContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem } from "@/lib/types";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  setCartItems: (items: CartItem[]) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItemsState] = useState<CartItem[]>(() => {
    const storedCart = sessionStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Sincroniza el carrito en sessionStorage cada vez que cambia el estado
  useEffect(() => {
    sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItemsState((prevItems) => [...prevItems, item]);
  };

  const updateCartItem = (productId: string, quantity: number) => {
    setCartItemsState((prevItems) =>
      prevItems.map((item) =>
        item.product.codsap === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItemsState((prevItems) =>
      prevItems.filter((item) => item.product.codsap !== productId)
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateCartItem,
        removeFromCart,
        setCartItems: setCartItemsState,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
