
import { Check } from "lucide-react";

interface AuthTypeSelectorProps {
  authType: "ldap" | "local";
  onAuthTypeChange: (type: "ldap" | "local") => void;
}

const AuthTypeSelector = ({ authType, onAuthTypeChange }: AuthTypeSelectorProps) => {
  return (
    <div className="flex justify-center space-x-8 w-full">
      <div 
        className="flex items-center space-x-2 cursor-pointer" 
        onClick={() => onAuthTypeChange("ldap")}
      >
        <div className={`w-5 h-5 rounded border flex items-center justify-center ${
          authType === "ldap" 
            ? "bg-blue-500 border-blue-500" 
            : "border-gray-300"
        }`}>
          {authType === "ldap" && <Check className="h-4 w-4 text-white" />}
        </div>
        <span className="text-sm text-gray-700">LDAP</span>
      </div>
      
      <div 
        className="flex items-center space-x-2 cursor-pointer" 
        onClick={() => onAuthTypeChange("local")}
      >
        <div className={`w-5 h-5 rounded border flex items-center justify-center ${
          authType === "local" 
            ? "bg-green-500 border-green-500" 
            : "border-gray-300"
        }`}>
          {authType === "local" && <Check className="h-4 w-4 text-white" />}
        </div>
        <span className="text-sm text-gray-700">Local</span>
      </div>
    </div>
  );
};

export default AuthTypeSelector;
