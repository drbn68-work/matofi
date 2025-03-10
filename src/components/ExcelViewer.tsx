import React, { useState } from "react";

const ExcelViewer = () => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL 
      const response = await fetch(`${API_BASE_URL}/products`);        
      if (!response.ok) throw new Error("Error al leer el archivo");
      const jsonData = await response.json();
      setData(jsonData.items);
    } catch (err) {
      setError("No se pudo cargar el archivo Excel");
    }
  };

  return (
    <div>
      <h2>Datos del Catálogo</h2>
      <button onClick={loadData}>Cargar Datos</button>
      {error && <p>{error}</p>}
      <table border={1}>
        <thead>
          <tr>{data.length > 0 && Object.keys(data[0]).map(key => <th key={key}>{key}</th>)}</tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>{Object.values(row).map((val, i) => <td key={i}>{String(val)}</td>
        )}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExcelViewer;
