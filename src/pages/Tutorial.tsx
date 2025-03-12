// src/pages/Tutorial.tsx
import React from "react";
import { HeaderSimple } from "@/components/layout/HeaderSimple";
import { User } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default function Tutorial() {
  // Recupera el usuario desde sessionStorage (opcional)
  const storedUser = sessionStorage.getItem("user");
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;

  const handleGoBack = () => {
    window.location.href = "/";
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabecera simple */}
      <HeaderSimple user={user} onLogout={handleLogout} onGoBack={handleGoBack} />

      <main className="container pt-24 pb-8">
        <h1 className="text-2xl font-bold mb-4">Tutorial d'ús</h1>

        <p className="mb-4">
          Benvingut/da al tutorial d'ús de l'aplicació de Material d'Oficina.
          Aquí trobaràs les instruccions bàsiques per fer comandes, consultar
          l'històric i gestionar el teu carret.
        </p>

        {/* Bloque nuevo: Video explicativo */}
        <div className="my-6">
          <h2 className="text-xl font-semibold mb-2">Video explicatiu</h2>
          <p className="mb-2 text-sm text-gray-600">
            Pots reproduir el següent vídeo per veure un exemple pràctic d'utilització de l'aplicació:
          </p>
          <video
            className="rounded-lg border shadow w-full max-w-xl"
            controls
          >
            <source src="/matofi.mp4" type="video/mp4" />
            El teu navegador no suporta la reproducció de vídeo.
          </video>
        </div>

        {/* Mantén el resto del texto existente */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Passos bàsics:</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Inicia sessió amb el teu usuari i contrasenya. El mateix que a HCIS.</li>
            <li>Cerca el material que necessites o selecciona una categoria per filtrar.</li>
            <li>Pots repetir comandes prèvies si vas a la secció 'Historial'.</li>
            <li>Afegeix els articles al carret i ajusta la quantitat si cal.</li>
            <li>Fes clic a “Confirmar sol·licitud". Pots veure la comanda feta a la secció 'Historial'</li>
            <li>Fes clic al icono de sortir de la sessió</li>
          </ol>
        </div>

        {/* Botón para volver a la página principal */}
        <div className="mt-8">
          <Button variant="outline" onClick={handleGoBack}>
            Tornar a l'inici
          </Button>
        </div>
      </main>
    </div>
  );
}
