
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loginWithLDAP } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  username: z.string().min(1, "Nombre de usuario requerido"),
  password: z.string().min(1, "Contraseña requerida"),
  costCenter: z.string().min(1, "Centro de coste requerido"),
});

type FormValues = z.infer<typeof formSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      costCenter: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const response = await loginWithLDAP(data);
      
      if (response.success && response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
        
        toast({
          title: "Inicio de sesión exitoso",
          description: `Bienvenido, ${response.user.fullName}`,
        });
        
        navigate("/");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error || "Error de autenticación",
        });
      }
    } catch (error) {
      console.error("Error de inicio de sesión:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al conectar con el servidor",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Card className="w-[350px]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Material d'Oficina</CardTitle>
          <CardDescription>
            Accede con tus credenciales LDAP
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de usuario</FormLabel>
                    <FormControl>
                      <Input placeholder="usuario" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="costCenter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Centro de coste</FormLabel>
                    <FormControl>
                      <Input placeholder="Centro de coste" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Autenticando..." : "Iniciar sesión"}
              </Button>
            </CardFooter>
          </form>
        </Form>

        <CardFooter className="flex flex-col items-center pt-0">
          <div className="text-xs text-gray-500 mt-4">
            Nota: Si el LDAP no está disponible, puedes usar:<br />
            Usuario: testuser<br />
            Contraseña: testuser
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
