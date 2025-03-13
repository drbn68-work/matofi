import React, { useState } from "react";
import { User } from "@/lib/types";
import { HeaderSimple } from "@/components/layout/HeaderSimple";
// Import your custom Button component
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ExcelViewerProps {
  user: User | null;
  onLogout: () => void;
}

export default function ExcelViewer({ user, onLogout }: ExcelViewerProps) {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) throw new Error("Error en llegir el fitxer");
      const jsonData = await response.json();
      setData(jsonData.items);
    } catch (err) {
      setError("No s'ha pogut carregar el fitxer Excel");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderSimple
        user={user}
        onLogout={onLogout}
        onGoBack={() => navigate("/")}
      />

      <main className="container pt-24">
        <div className="max-w-xl mx-auto bg-white border border-gray-200 p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Dades del Catàleg
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Fes clic a <strong>"Carregar Dades"</strong> per veure la informació
            actual del catàleg.
          </p>

          {/* Use your Button component for consistent styling */}
          <Button variant="outline" size="sm" onClick={loadData}>
            Carregar Dades
          </Button>

          {error && <p className="mt-4 text-red-600">{error}</p>}

          {data.length > 0 && (
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    {Object.keys(data[0]).map((key) => (
                      <th
                        key={key}
                        className="px-2 py-1 text-left text-sm font-medium text-gray-700 border-b"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.values(row).map((val, i) => (
                        <td
                          key={i}
                          className="px-2 py-1 border-b text-sm text-gray-600"
                        >
                          {String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
