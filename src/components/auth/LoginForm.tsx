
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { LoginCredentials } from "@/lib/types";
import AuthTypeSelector from "./AuthTypeSelector";

const formSchema = z.object({
  username: z.string().min(1, "Nom d'usuari requerit"),
  password: z.string().min(1, "Contrasenya requerida"),
  costCenter: z.string().min(1, "Centre de cost requerit"),
  authType: z.enum(["ldap", "local"]).default("ldap"),
});

type FormValues = z.infer<typeof formSchema>;

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authType, setAuthType] = useState<"ldap" | "local">("ldap");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
    setErrorMessage(null);
    
    // Incluir el tipo de autenticación en los datos
    const loginData: LoginCredentials = {
      username: data.username,
      password: data.password,
      costCenter: data.costCenter,
      authType
    };
    
    try {
      console.log("Iniciando proceso de autenticación...");
      const response = await loginWithLDAP(loginData);
      
      if (response.success && response.user) {
        console.log("Autenticación exitosa:", response.user);
        localStorage.setItem("user", JSON.stringify(response.user));
        
        toast({
          title: "Inici de sessió exitós",
          description: `Benvingut, ${response.user.fullName}`,
        });
        
        navigate("/");
      } else {
        // Guardamos el mensaje de error para mostrarlo en el formulario
        console.error("Error de autenticación:", response.error);
        setErrorMessage(response.error || "Error d'autenticació desconegut");
        
        toast({
          variant: "destructive",
          title: "Error d'autenticació",
          description: "S'ha produït un error. Consulta els detalls a continuació.",
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Error desconegut";
      console.error("Error d'inici de sessió:", error);
      
      setErrorMessage(`Error de connexió: ${errorMsg}`);
      
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
    setErrorMessage(null);
    
    // Si es selecciona "local", auto-emplenar amb les credencials de prova
    if (type === "local") {
      form.setValue("username", "testuser");
      form.setValue("password", "testuser");
      form.setValue("costCenter", "1234");  // Añadir un centro de coste por defecto
    } else {
      // Si tornem a LDAP, netejar els camps si contenen les credencials de prova
      if (form.getValues("username") === "testuser") {
        form.setValue("username", "");
        form.setValue("password", "");
        form.setValue("costCenter", "");
      }
    }
  };

  // Función para formatear el mensaje de error con saltos de línea
  const formatErrorMessage = (message: string) => {
    return message.split('\n').map((line, index) => (
      <span key={index} className="block">
        {line}
      </span>
    ));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive" className="mb-4 border-red-500 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <AlertTitle className="text-sm font-medium text-red-600">Error d'autenticació</AlertTitle>
              <AlertDescription className="mt-2 text-xs text-red-600 max-h-60 overflow-y-auto">
                {formatErrorMessage(errorMessage)}
              </AlertDescription>
            </Alert>
          )}
        
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
        </div>
        <div className="flex flex-col space-y-4 mt-6">
          <Button
            type="submit"
            className="w-full bg-blue-800 hover:bg-blue-900"
            disabled={isLoading}
          >
            {isLoading ? "Autenticant..." : "Iniciar Sessió"}
          </Button>
          
          <AuthTypeSelector 
            authType={authType} 
            onAuthTypeChange={handleAuthTypeChange} 
          />
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
