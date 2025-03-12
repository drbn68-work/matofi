// src/pages/OrdersHistory.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { HeaderSimple } from "@/components/layout/HeaderSimple";
import { User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";
import { FaShoppingCart } from "react-icons/fa";

export default function OrdersHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  // Mapa para controlar qué pedido muestra el ícono en verde
  const [cartFilledMap, setCartFilledMap] = useState<Record<string, boolean>>({});

  const navigate = useNavigate();
  const { toast } = useToast();
  const { cartItems, setCartItems } = useCart();

  // Recuperar el usuario desde sessionStorage
  const user: User | null = JSON.parse(sessionStorage.getItem("user") || "null");
  const department = sessionStorage.getItem("department");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!department) {
      navigate("/");
      return;
    }

    axios
      .get(`${API_URL}/orders?department=${encodeURIComponent(department)}`)
      .then((response) => {
        setOrders(response.data.orders);
      })
      .catch((error) => {
        console.error("Error en carregar comandes:", error);
      });
  }, [department, API_URL, navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const handleGoBack = () => {
    navigate("/");
  };

  const toggleExpand = (orderId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleCopyToCart = (order: any) => {
    let newCart = [...cartItems];

    for (const item of order.items) {
      // Se agrega la propiedad 'categoria' al objeto product
      const product = {
        codsap: item.codsap,
        descripcion: item.descripcion,
        codas400: item.codas400,
        ubicacion: item.ubicacion,
        categoria: item.categoria || "", // Valor por defecto si no existe
      };

      const existingIndex = newCart.findIndex(
        (cartItem: any) => cartItem.product.codsap === product.codsap
      );

      if (existingIndex > -1) {
        newCart[existingIndex].quantity = item.quantity;
      } else {
        newCart.push({ product, quantity: item.quantity });
      }
    }

    setCartItems(newCart);

    toast({
      variant: "default",
      title: "Comanda copiada al carret",
      description: "Els articles han estat afegits al teu carret.",
      className: "bg-green-200 text-green-900",
    });

    // Solo el ícono de este pedido se pone verde durante 2s
    setCartFilledMap((prev) => ({ ...prev, [order.id]: true }));
    setTimeout(() => {
      setCartFilledMap((prev) => ({ ...prev, [order.id]: false }));
    }, 2000);
  };

  if (!orders.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderSimple user={user} onLogout={handleLogout} onGoBack={handleGoBack} />
        <main className="container pt-24">
          <h1 className="text-xl font-bold mb-4">Històric de comandes</h1>
          <p className="text-gray-600 text-sm">
            No s'han realitzat comandes per aquest centre de cost.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderSimple user={user} onLogout={handleLogout} onGoBack={handleGoBack} />
      <main className="container pt-24">
        <h1 className="text-xl font-bold mb-6">
          Històric de comandes sol·licitades des del CAI de l'usuari
        </h1>
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order: any) => {
            const isExpanded = expanded[order.id] || false;
            return (
              <div
                key={order.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm text-sm text-gray-700"
              >
                <div className="flex flex-col gap-1 mb-3">
                  <p className="text-gray-900 font-semibold">
                    ID: <span className="font-normal text-gray-800">{order.id}</span>
                  </p>
                  {order.full_name && (
                    <p className="text-gray-900 font-semibold">
                      Usuari sol·licitant:{" "}
                      <span className="font-normal text-gray-800">
                        {order.full_name}
                      </span>
                    </p>
                  )}
                  <p className="text-gray-900 font-semibold">
                    Centre de Cost:{" "}
                    <span className="font-normal text-gray-800">
                      {order.cost_center}
                    </span>
                  </p>
                  <p className="text-gray-900 font-semibold">
                    Data:{" "}
                    <span className="font-normal text-gray-800">
                      {new Date(order.created_at).toLocaleString("es-ES")}
                    </span>
                  </p>
                </div>

                {order.items && order.items.length > 0 && (
                  <div className="mb-2 flex gap-2">
                    <Button
                      onClick={() => toggleExpand(order.id)}
                      variant="outline"
                      size="sm"
                    >
                      {isExpanded
                        ? "Amagar articles"
                        : `Mostra articles (${order.items.length})`}
                    </Button>
                    <Button
                      onClick={() => handleCopyToCart(order)}
                      variant="primary"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <FaShoppingCart
                        className={`h-4 w-4 ${
                          cartFilledMap[order.id] ? "text-green-600" : "text-white"
                        }`}
                      />
                      <span>Copiar al carret</span>
                    </Button>
                  </div>
                )}

                {isExpanded && order.items && (
                  <ul className="list-disc ml-6 space-y-1">
                    {order.items.map((item: any) => (
                      <li key={item.id}>
                        <span className="font-medium">{item.quantity}x</span>{" "}
                        {item.descripcion}{" "}
                        <span className="text-gray-500">(SAP: {item.codsap})</span>
                      </li>
                    ))}
                  </ul>
                )}

                {!order.items?.length && (
                  <p className="text-gray-600 mb-2">
                    No hi ha articles per aquesta comanda.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
