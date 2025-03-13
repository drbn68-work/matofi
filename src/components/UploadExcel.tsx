import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/lib/types";
import { HeaderSimple } from "@/components/layout/HeaderSimple";
// Import your custom Button component
import { Button } from "@/components/ui/button";

interface UploadExcelProps {
  user: User | null;
  onLogout: () => void;
}

export default function UploadExcel({ user, onLogout }: UploadExcelProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Selecciona un fitxer Excel primer.");
      return;
    }

    const formData = new FormData();
    formData.append("excel", file);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_BASE_URL}/upload-excel`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setUploadStatus("Fitxer pujat amb èxit.");
      } else {
        setUploadStatus("Error al pujar el fitxer.");
      }
    } catch (error) {
      console.error("Error al pujar el fitxer:", error);
      setUploadStatus("Error en connectar amb el servidor.");
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
        <div className="max-w-md mx-auto bg-white border border-gray-200 p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Pujar Catàleg de Material
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Selecciona un fitxer Excel anomenat <strong>catalogomatofi.xlsx</strong> i fes clic a{" "}
            <strong>"Pujar Excel"</strong> per actualitzar el catàleg.
          </p>


          <div className="flex items-center mb-4">
            <input
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              className="border border-gray-300 p-2 rounded text-sm text-gray-700"
            />
          </div>

          {/* Use your Button component for consistent styling */}
          <Button variant="outline" size="sm" onClick={handleUpload}>
            Pujar Excel
          </Button>

          {uploadStatus && (
            <p className="mt-4 text-sm font-medium text-gray-700">
              {uploadStatus}
            </p>
          )}
        </div>

        <div className="max-w-md mx-auto mt-4 text-xs text-gray-500 italic">
          <p>
            Perquè el procés funcioni correctament, assegura't que el fitxer
            <strong> catalogomatofi.xlsx </strong> inclogui les columnes
            <strong> codsap</strong>, <strong> codas400</strong>,
            <strong> descripcion</strong>, <strong> ubicacion</strong>, i
            <strong> categoria</strong> en aquest ordre.
          </p>
        </div>



      </main>
    </div>
  );
}
