
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import LoginHeader from "@/components/auth/LoginHeader";
import LoginForm from "@/components/auth/LoginForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Verificar si el usuario ya está autenticado al cargar la página
    const user = localStorage.getItem("user");
    if (user) {
      console.log("Login - Usuario ya autenticado, redirigiendo a /");
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Card className="w-[350px]">
        <LoginHeader />
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
