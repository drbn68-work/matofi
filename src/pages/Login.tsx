
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  username: z.string().min(1, "Nom d'usuari requerit"),
  password: z.string().min(1, "Contrasenya requerida"),
  costCenter: z.string().min(1, "Centre de cost requerit"),
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
    
    // Incluir el tipo de autenticación en los datos
    const loginData: LoginCredentials = {
      username: data.username,
      password: data.password,
      costCenter: data.costCenter,
      authType
    };
    
    try {
      const response = await loginWithLDAP(loginData);
      
      if (response.success && response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
        
        toast({
          title: "Inici de sessió exitós",
          description: `Benvingut, ${response.user.fullName}`,
        });
        
        navigate("/");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error || "Error d'autenticació",
        });
      }
    } catch (error) {
      console.error("Error d'inici de sessió:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al connectar amb el servidor",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthTypeChange = (type: "ldap" | "local") => {
    setAuthType(type);
    
    // Si es selecciona "local", auto-emplenar amb les credencials de prova
    if (type === "local") {
      form.setValue("username", "testuser");
      form.setValue("password", "testuser");
    } else {
      // Si tornem a LDAP, netejar els camps si contenen les credencials de prova
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
          <div className="flex justify-center mb-2">
            <img 
              src="/lovable-uploads/167dfe77-7dcb-491e-965c-7a888b9ad928.png" 
              alt="Fundació Puigvert" 
              className="h-16"
            />
          </div>
          <CardTitle className="text-xl">Sol·licitud de Material d'Oficina</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuari</FormLabel>
                    <FormControl>
                      <Input placeholder="usuari" {...field} />
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
                    <FormLabel>Contrasenya</FormLabel>
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
                    <FormLabel>Centre de Cost</FormLabel>
                    <FormControl>
                      <Input placeholder="Centre de cost" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-blue-800 hover:bg-blue-900"
                disabled={isLoading}
              >
                {isLoading ? "Autenticant..." : "Iniciar Sessió"}
              </Button>
              
              <div className="flex justify-center space-x-8 w-full pt-2">
                <div 
                  className="flex items-center space-x-2 cursor-pointer" 
                  onClick={() => handleAuthTypeChange("ldap")}
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                    authType === "ldap" 
                      ? "bg-blue-500 border-blue-500" 
                      : "border-gray-300"
                  }`}>
                    {authType === "ldap" && <Check className="h-4 w-4 text-white" />}
                  </div>
                  <span className="text-sm">LDAP</span>
                </div>
                
                <div 
                  className="flex items-center space-x-2 cursor-pointer" 
                  onClick={() => handleAuthTypeChange("local")}
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                    authType === "local" 
                      ? "bg-green-500 border-green-500" 
                      : "border-gray-300"
                  }`}>
                    {authType === "local" && <Check className="h-4 w-4 text-white" />}
                  </div>
                  <span className="text-sm">Local</span>
                </div>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
