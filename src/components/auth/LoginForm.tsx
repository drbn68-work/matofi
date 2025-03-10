import { useState } from "react"; 
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { loginWithLDAP } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import AuthTypeSelector from "./AuthTypeSelector";
import { LoginCredentials } from "@/lib/types";

const formSchema = z.object({
  username: z.string().min(1, "Nom d'usuari requerit"),
  password: z.string().min(1, "Contrasenya requerida"),
  authType: z.enum(["ldap", "local"]).default("ldap"),
});

type FormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  onLoginSuccess: (userData: any) => void;
  onError: (errMsg: string) => void;
}

export default function LoginForm({ onLoginSuccess, onError }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [authType, setAuthType] = useState<"ldap" | "local">("ldap");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      authType: "ldap",
    },
  });

  const onSubmit = async (data: FormValues): Promise<void> => {
    setIsLoading(true);
    setErrorMessage(null);

    const loginData: LoginCredentials = {
      username: data.username,
      password: data.password,
      authType,
    };

    try {
      // Modo local para pruebas
      if (authType === "local") {
        if (data.username === "testuser" && data.password === "testuser") {
          const fakeUser = {
            username: "testuser",
            fullName: "Test User",
            department: "",
            email: "",
            costCenter: "" // se deja vacío para que el usuario lo complete
          };
          toast({
            title: "Inici de sessió realitzat correctament",
            description: `Benvingut, ${fakeUser.fullName}`,
          });
          // Guardamos el usuario en sessionStorage para que persista durante la sesión
          sessionStorage.setItem("user", JSON.stringify(fakeUser));
          onLoginSuccess(fakeUser);
        } else {
          const errorMsg = "Credenciales inválidas para el modo local.";
          setErrorMessage(errorMsg);
          onError(errorMsg);
          toast({
            variant: "destructive",
            title: "Error d'autenticació",
            description: errorMsg,
          });
        }
        setIsLoading(false);
        return;
      }

      // Modo LDAP: llamamos al servicio de autenticación
      console.log("Iniciando proceso de autenticación...");
      const response = await loginWithLDAP(loginData);

      if (!response) {
        throw new Error("No se ha recibido respuesta del servidor de autenticación.");
      }

      const { success, user, error } = response;

      if (success && user) {
        console.log("Autenticación exitosa:", user);
        toast({
          title: "Inici de sessió realitzat correctament",
          description: `Benvingut, ${user.fullName}`,
        });
        // Guardamos el usuario en sessionStorage para que persista durante la sesión
        sessionStorage.setItem("user", JSON.stringify(user));
        onLoginSuccess(user);
      } else {
        console.error("Error de autenticación:", error);
        setErrorMessage(error || "Error d'autenticació desconegut");
        onError(error || "Error d'autenticació desconegut");
        toast({
          variant: "destructive",
          title: "Error d'autenticació",
          description: "S'ha produït un error. Consulta els detalls a continuació.",
        });
      }
    } catch (err: any) {
      const errorMsg = err instanceof Error ? err.message : "Error desconegut";
      console.error("Error d'inici de sessió:", err);
      setErrorMessage(`Error de connexió: ${errorMsg}`);
      onError(`Error de connexió: ${errorMsg}`);
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

    if (type === "local") {
      form.setValue("username", "testuser");
      form.setValue("password", "testuser");
    } else {
      if (form.getValues("username") === "testuser") {
        form.setValue("username", "");
        form.setValue("password", "");
      }
    }
  };

  const formatErrorMessage = (message: string) => {
    return message.split("\n").map((line, index) => (
      <span key={index} className="block">
        {line}
      </span>
    ));
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      {errorMessage && (
        <Alert variant="destructive" className="mb-4 border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertTitle className="text-sm font-medium text-red-600">
            Error d'autenticació
          </AlertTitle>
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
          <p className="text-sm text-red-600">
            {form.formState.errors.username.message}
          </p>
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
          <p className="text-sm text-red-600">
            {form.formState.errors.password.message}
          </p>
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
        <AuthTypeSelector authType={authType} onAuthTypeChange={handleAuthTypeChange} />
      </div>
    </form>
  );
}
