import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import { LoginHeader } from "@/components/auth/LoginHeader";

// Nota el "setUser" en las props
export default function Login({ setUser }: { setUser: (u: any) => void }) {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Esta función se llamará cuando el login sea exitoso
  const handleLoginSuccess = (userData: any) => {
    // Guardar en localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    // Avisar a App de que hay nuevo usuario
    setUser(JSON.stringify(userData));
    // Redirigir
    navigate("/");
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-[450px] p-6 bg-white rounded shadow-sm">
        <LoginHeader />
        {/*
          Pasamos handleLoginSuccess y onError para controlar 
          lo que ocurra tras la autenticación
        */}
        <LoginForm onLoginSuccess={handleLoginSuccess} onError={setError} />
        {error && <div className="text-red-600">Error: {error}</div>}
      </div>
    </div>
  );
}
