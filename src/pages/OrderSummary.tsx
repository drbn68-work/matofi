import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Printer, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface OrderSummaryPageState {
  items: any[];
  userInfo: {
    username?: string;
    fullName: string;
    department: string;
    costCenter: string; // Ej.: "3145 - UCIPO"
    email: string;
  };
  deliveryLocation: string;
  comments: string;
}

const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const state = location.state as OrderSummaryPageState;

  useEffect(() => {
    if (!location.state) {
      navigate("/");
      return;
    }
  }, [location.state, navigate]);

  const handleGoToIndex = () => {
    navigate(-1);
  };

  const handleSendOrder = async () => {
    try {
      const payload = {
        userInfo: {
          username: state.userInfo.username,
          fullName: state.userInfo.fullName,
          department: state.userInfo.department,
          costCenter: state.userInfo.costCenter,
          email: state.userInfo.email,
        },
        deliveryLocation: state.deliveryLocation,
        comments: state.comments,
        items: state.items.map((item) => ({
          descripcion: item.product.descripcion,
          codsap: item.product.codsap,
          codas400: item.product.codas400,
          ubicacion: item.product.ubicacion,
          quantity: item.quantity,
        })),
      };

      await axios.post(`${API_URL}/sendOrder`, payload, { withCredentials: true });
      
      // Toast de éxito con variant "default" (personaliza su estilo en CSS si es necesario)
      toast({
        variant: "default",
        title: "Correu enviat",
        description: "La sol·licitud ha estat enviada al departament de compres",
        duration: 3000,
        className: "bg-green-200 text-green-900",
      });

      // Esperar 5 segundos antes de hacer logout y redirigir
      setTimeout(() => {
        sessionStorage.clear();
        window.location.href = "/login";
      }, 3000);
    } catch (error) {
      console.error("Error enviant la sol·licitud:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No s'ha pogut enviar el correu. Si us plau, imprimeix el resum.",
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLogout = () => {
    sessionStorage.clear();
    toast({
      title: "Sessió tancada",
      description: "Has tancat la sessió correctament",
    });
    setTimeout(() => {
      window.location.href = "/login";
    }, 100);
  };

  if (!state) return null;

  return (
    <div className="min-h-screen bg-white print-area">
      <div className="container max-w-4xl mx-auto py-8">
        {/* Encabezado principal */}
        <div className="flex items-center justify-between border-b pb-4">
          <img
            src="/lovable-uploads/70d83c98-5a0d-49cd-854d-2029b792990b.png"
            alt="Fundació Puigvert"
            className="h-16"
          />
          <h1 className="text-2xl font-bold text-primary">Sol·licitud de Material</h1>
        </div>

        {/* Botones en la parte superior */}
        <div className="flex flex-wrap gap-2 mt-4 no-print">
          <Button onClick={handleGoToIndex} variant="outline" className="px-4 py-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Tornar a selecció d'articles
          </Button>
          <Button onClick={handlePrint} variant="outline" className="px-4 py-2">
            <Printer className="h-4 w-4 mr-1" />
            Imprimir
          </Button>
          <Button onClick={handleSendOrder} variant="secondary" className="px-4 py-2">
            Enviar sol·licitud a Compres
          </Button>
          <Button onClick={handleLogout} variant="outline" className="px-4 py-2">
            <LogOut className="h-4 w-4 mr-1" />
            Tancar sessió
          </Button>
        </div>

        {/* Contenido principal */}
        <div className="space-y-8 mt-6">
          {/* Información de la solicitud en tabla elegante */}
          <div className="bg-gray-50 p-4 rounded-lg print:bg-white print:border">
            <h2 className="text-lg font-semibold mb-4">Informació de la Sol·licitud</h2>
            <table className="w-full text-xs text-gray-700">
              <tbody>
                {state.userInfo.username && (
                  <tr className="border-b last:border-0">
                    <td className="py-1 font-semibold w-1/3">Usuari (username)</td>
                    <td className="py-1">{state.userInfo.username}</td>
                  </tr>
                )}
                <tr className="border-b last:border-0">
                  <td className="py-1 font-semibold w-1/3">Nom complet</td>
                  <td className="py-1">{state.userInfo.fullName}</td>
                </tr>
                <tr className="border-b last:border-0">
                  <td className="py-1 font-semibold w-1/3">Departament</td>
                  <td className="py-1">{state.userInfo.department}</td>
                </tr>
                <tr className="border-b last:border-0">
                  <td className="py-1 font-semibold w-1/3">Correu electrònic</td>
                  <td className="py-1">{state.userInfo.email}</td>
                </tr>
                <tr className="border-b last:border-0">
                  <td className="py-1 font-semibold w-1/3">Centre de cost (CAI Petició)</td>
                  <td className="py-1">{state.userInfo.costCenter}</td>
                </tr>
                <tr className="border-b last:border-0">
                  <td className="py-1 font-semibold w-1/3">Lloc de lliurament</td>
                  <td className="py-1">{state.deliveryLocation}</td>
                </tr>
                {state.comments && (
                  <tr className="border-b last:border-0">
                    <td className="py-1 font-semibold w-1/3">Comentaris</td>
                    <td className="py-1">{state.comments}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Lista de artículos con filas compactas */}
          <div className="bg-gray-50 p-4 rounded-lg print:bg-white print:border">
            <h2 className="text-lg font-semibold mb-4">Articles Sol·licitats</h2>
            <div className="divide-y">
              {state.items.map((item) => (
                <div key={item.product.codsap} className="py-1 flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-xs">{item.product.descripcion}</p>
                    <p className="text-xs text-gray-500">
                      SAP: {item.product.codsap} | AS400: {item.product.codas400}
                    </p>
  
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium whitespace-nowrap text-xs">
                      {item.quantity} unitats
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
