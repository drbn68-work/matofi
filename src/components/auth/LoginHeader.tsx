
export const LoginHeader = () => {
  return (
    <div className="mb-6 flex flex-col items-center">
      <div className="flex justify-center mb-4">
        <img 
          src="/lovable-uploads/8f0fb3de-7ace-4eb3-8769-ce306cdafe27.png" 
          alt="Fundació Puigvert" 
          className="h-16"
        />
      </div>
      <h1 className="text-2xl font-bold text-center text-gray-900">
        Sol·licitud de Material d'Oficina
      </h1>
      {/* Mostrar el valor de VITE_API_URL */}
      <p className="text-sm text-gray-600 mt-2">
        API URL: {import.meta.env.VITE_API_URL || "undefined"}
      </p>
    </div>
  );
};

export default LoginHeader; 
