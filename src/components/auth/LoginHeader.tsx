
import { CardHeader, CardTitle } from "@/components/ui/card";

const LoginHeader = () => {
  return (
    <CardHeader className="text-center">
      <div className="flex justify-center mb-2">
        <img 
          src="/lovable-uploads/8f0fb3de-7ace-4eb3-8769-ce306cdafe27.png" 
          alt="Fundació Puigvert" 
          className="h-16"
        />
      </div>
      <CardTitle className="text-xl">Sol·licitud de Material d'Oficina</CardTitle>
    </CardHeader>
  );
};

export default LoginHeader;
