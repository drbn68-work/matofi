
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { loginWithLDAP, testApiConnection } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import AuthTypeSelector from "./AuthTypeSelector";
import { LoginCredentials } from "@/lib/types";
import axios from "axios";

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
  const [isServerAvailable, setIsServerAvailable] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Verificar si el servidor está disponible al cargar el componente
    const checkServerAvailability = async () => {
      try {
        // Primero intentamos con la ruta de prueba
        const isAvailable = await testApiConnection();
        setIsServerAvailable(isAvailable);

        if (!isAvailable) {
          console.warn("El servidor no está disponible. Algunas funciones pueden no estar operativas.");
        }
      } catch (error) {
        console.error("Error al verificar disponibilidad del servidor:", error);
        setIsServerAvailable(false);
      }
    };

    checkServerAvailability();
  }, []);

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
    
    // Modo de desarrollo: permitir login local sin servidor
    if (authType === 'local' && data.username === 'testuser' && data.password === 'testuser' && !isServerAvailable) {
      // Simular autenticación exitosa para desarrollo sin servidor
      console.log("Modo de desarrollo: autenticación local sin servidor");
      
      // Crear un usuario ficticio para el modo desarrollo
      const mockUser = {
        username: data.username,
        fullName: `Usuario de Prueba (${data.username})`,
        costCenter: data.costCenter,
        department: 'Departamento de Prueba'
      };
      
      // Guardar estado de autenticación en sessionStorage (solo para desarrollo)
      sessionStorage.setItem('auth_user', JSON.stringify(mockUser));
      sessionStorage.setItem('is_authenticated', 'true');
      
      toast({
        title: "Inici de sessió exitós (Modo Desarrollo)",
        description: `Benvingut, ${mockUser.fullName}`,
      });
      
      setIsLoading(false);
      navigate("/");
      return;
    }
    
    // Proceso normal de autenticación
    const loginData: LoginCredentials = {
      username: data.username,
      password: data.password,
      costCenter: data.costCenter,
      authType
    };
    
    try {
      console.log("Iniciando proceso de autenticación...", loginData);
      const response = await loginWithLDAP(loginData);
      
      if (response.success && response.user) {
        console.log("Autenticación exitosa:", response.user);
        
        // Almacenar el estado de autenticación en sessionStorage como respaldo
        // (se usará solo si las cookies no funcionan)
        sessionStorage.setItem('auth_user', JSON.stringify(response.user));
        sessionStorage.setItem('is_authenticated', 'true');
        
        toast({
          title: "Inici de sessió exitós",
          description: `Benvingut, ${response.user.fullName}`,
        });
        
        // Redirigimos a la página principal
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      {!isServerAvailable && authType === 'local' && (
        <Alert className="mb-4 border-yellow-500 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <AlertTitle className="text-sm font-medium text-yellow-600">Mode desenvolupament</AlertTitle>
          <AlertDescription className="mt-2 text-xs text-yellow-600">
            El servidor no està disponible. S'utilitzarà mode de desenvolupament local.
          </AlertDescription>
        </Alert>
      )}
      
      {errorMessage && (
        <Alert variant="destructive" className="mb-4 border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertTitle className="text-sm font-medium text-red-600">Error d'autenticació</AlertTitle>
          <AlertDescription className="mt-2 text-xs text-red-600 max-h-60 overflow-y-auto">
            {formatErrorMessage(errorMessage)}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-1">
        <label htmlFor="username" className="block text-sm font-medium text-gray-800">
          Usuari
        </label>
        <input
          id="username"
          type="text"
          {...form.register("username")}
          placeholder="usuari"
          className="w-full px-3 py-2 bg-blue-50 border border-gray-300 rounded text-gray-900"
        />
        {form.formState.errors.username && (
          <p className="text-sm text-red-600">{form.formState.errors.username.message}</p>
        )}
      </div>
      
      <div className="space-y-1">
        <label htmlFor="password" className="block text-sm font-medium text-gray-800">
          Contrasenya
        </label>
        <input
          id="password"
          type="password"
          {...form.register("password")}
          placeholder="••••••••"
          className="w-full px-3 py-2 bg-blue-50 border border-gray-300 rounded text-gray-900"
        />
        {form.formState.errors.password && (
          <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
        )}
      </div>
      
      <div className="space-y-1">
        <label htmlFor="costCenter" className="block text-sm font-medium text-gray-800">
          Centre de Cost
        </label>
        <input
          id="costCenter"
          type="text"
          {...form.register("costCenter")}
          placeholder="Centre de cost"
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900"
        />
        {form.formState.errors.costCenter && (
          <p className="text-sm text-red-600">{form.formState.errors.costCenter.message}</p>
        )}
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 text-white bg-[#1a365d] hover:bg-[#162e4d] rounded-md transition-colors"
      >
        {isLoading ? "Autenticant..." : "Iniciar Sessió"}
      </button>
      
      <div className="pt-1">
        <AuthTypeSelector 
          authType={authType} 
          onAuthTypeChange={handleAuthTypeChange} 
        />
      </div>
    </form>
  );
};

export default LoginForm;
