
import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface OrderSummaryPageState {
  items: any[];
  userInfo: {
    fullName: string;
    department: string;
    costCenter: string;
    email: string;
  };
  deliveryLocation: string;
  comments: string;
}

const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);
  const state = location.state as OrderSummaryPageState;

  useEffect(() => {
    if (!location.state) {
      navigate("/");
      return;
    }

    const sendEmail = async () => {
      try {
        await axios.post("/api/send-order-email", {
          items: state.items,
          userInfo: state.userInfo,
          deliveryLocation: state.deliveryLocation,
          comments: state.comments
        });

        toast({
          title: "Correu enviat",
          description: "La sol·licitud ha estat enviada al departament de compres",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No s'ha pogut enviar el correu. Si us plau, imprimiu el resum.",
        });
      }
    };

    sendEmail();
  }, [location.state, navigate, toast]);

  if (!state) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleLogout = () => {
    // Eliminar datos del usuario del localStorage
    localStorage.clear(); // Limpiamos todo el localStorage
    
    // Mostrar mensaje de despedida
    toast({
      title: "Sessió tancada",
      description: "Has tancat la sessió correctament",
    });

    // Forzar una recarga completa de la aplicación después de un breve retraso
    setTimeout(() => {
      window.location.href = "/login";
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white print-area">
      <div className="container max-w-4xl mx-auto py-8">
        <div ref={printRef} className="space-y-8">
          <div className="flex items-center justify-between border-b pb-4">
            <img
              src="/lovable-uploads/70d83c98-5a0d-49cd-854d-2029b792990b.png"
              alt="Fundació Puigvert"
              className="h-16"
            />
            <h1 className="text-2xl font-bold text-primary">Sol·licitud de Material</h1>
          </div>

          <div className="grid gap-8">
            <div className="bg-gray-50 p-6 rounded-lg print:bg-white print:border">
              <h2 className="text-lg font-semibold mb-4">Informació de la Sol·licitud</h2>
              <div className="grid gap-2">
                <p><strong>Sol·licitant:</strong> {state.userInfo.fullName}</p>
                <p><strong>Departament:</strong> {state.userInfo.department}</p>
                <p><strong>Centre de cost:</strong> {state.userInfo.costCenter}</p>
                <p><strong>Correu electrònic:</strong> {state.userInfo.email}</p>
                <p><strong>Lloc de lliurament:</strong> {state.deliveryLocation}</p>
                {state.comments && (
                  <p><strong>Comentaris:</strong> {state.comments}</p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg print:bg-white print:border">
              <h2 className="text-lg font-semibold mb-4">Articles Sol·licitats</h2>
              <div className="divide-y">
                {state.items.map((item) => (
                  <div key={item.product.id} className="py-4 flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{item.product.descripcion}</p>
                      <p className="text-sm text-gray-500">
                        SAP: {item.product.codsap} | AS400: {item.product.codas400}
                      </p>
                      <p className="text-sm text-gray-500">
                        Ubicación: {item.product.ubicacion}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium whitespace-nowrap">{item.quantity} unitats</span>
                      <div className="w-6 h-6 border rounded-sm print:border-2 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8 no-print">
          <Button onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Imprimir
          </Button>
          <Button onClick={handleLogout} variant="outline" className="gap-2">
            <LogOut className="h-4 w-4" />
            Tancar sessió
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
