
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
import { Toggle } from "@/components/ui/toggle";

const formSchema = z.object({
  username: z.string().min(1, "Nombre de usuario requerido"),
  password: z.string().min(1, "Contraseña requerida"),
  costCenter: z.string().min(1, "Centro de coste requerido"),
  authType: z.enum(["ldap", "local"]).default("ldap"),
});

type FormValues = z.infer<typeof formSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authType, setAuthType] = useState<"ldap" | "local">("ldap");
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      costCenter: "",
      authType: "ldap",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    // Usar el authType del estado local
    const loginData = {
      ...data, 
      authType
    };
    
    try {
      const response = await loginWithLDAP(loginData);
      
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

  const handleAuthTypeChange = (type: "ldap" | "local") => {
    setAuthType(type);
    
    // Si se selecciona "local", auto-rellenar con las credenciales de prueba
    if (type === "local") {
      form.setValue("username", "testuser");
      form.setValue("password", "testuser");
    } else {
      // Si volvemos a LDAP, limpiar los campos
      if (form.getValues("username") === "testuser") {
        form.setValue("username", "");
        form.setValue("password", "");
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Card className="w-[350px]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Material d'Oficina</CardTitle>
          <CardDescription>
            Accede a la aplicación
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="flex justify-center space-x-4 mb-2">
                <Toggle
                  pressed={authType === "ldap"}
                  onPressedChange={() => handleAuthTypeChange("ldap")}
                  className="data-[state=on]:bg-blue-500"
                >
                  LDAP
                </Toggle>
                <Toggle
                  pressed={authType === "local"}
                  onPressedChange={() => handleAuthTypeChange("local")}
                  className="data-[state=on]:bg-green-500"
                >
                  Local
                </Toggle>
              </div>
              
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
      </Card>
    </div>
  );
};

export default Login;
