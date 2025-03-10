import React, { useState } from "react";

const UploadExcel = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Selecciona un archivo Excel primero.");
      return;
    }

    const formData = new FormData();
    formData.append("excel", file);

    try {
        const API_BASE_URL = import.meta.env.VITE_API_URL 
        const response = await fetch(`${API_BASE_URL}/upload-excel`, {
            method: "POST",
            body: formData,
        });
       

      if (response.ok) {
        setUploadStatus("Archivo subido con éxito.");
      } else {
        setUploadStatus("Error al subir el archivo.");
      }
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      setUploadStatus("Error al conectar con el servidor.");
    }
  };

  return (
    <div>
      <h2>Subir Catálogo de Material</h2>
      <input type="file" accept=".xlsx" onChange={handleFileChange} />
      <button onClick={handleUpload}>Subir Excel</button>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default UploadExcel;
