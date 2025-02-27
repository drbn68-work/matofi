
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import LoginHeader from "@/components/auth/LoginHeader";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
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
