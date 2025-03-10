import React from "react";

export default function EnvDisplay() {
  return (
    <div style={{ padding: "1rem", background: "#eee", margin: "1rem 0" }}>
      <h3>Valor de VITE_API_URL:</h3>
      <p>{import.meta.env.VITE_API_URL || "undefined"}</p>
    </div>
  );
}
