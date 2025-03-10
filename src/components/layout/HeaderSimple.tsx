// src/components/layout/HeaderSimple.tsx

import React from "react";
import { LogOut, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/types";

interface HeaderSimpleProps {
  // Even though this component reads user from sessionStorage,
  // we declare a user prop so TS won't complain when passing user={...}.
  user?: User | null;
  // The parent can pass a logout function (e.g. clearing sessionStorage, etc.)
  onLogout: () => void;
  // The parent can pass a go-back function (navigate("/"), etc.)
  onGoBack: () => void;
}

export function HeaderSimple({
  user,
  onLogout,
  onGoBack,
}: HeaderSimpleProps) {
  // If no user prop is passed, we also read from sessionStorage
  const storedUser = sessionStorage.getItem("user");
  const localUser: User | null = storedUser ? JSON.parse(storedUser) : null;
  const userToShow = user ?? localUser;

  // Keep your internal handleLogout logic
  const handleLogout = () => {
    // Example logic from Header.tsx
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("cartItems");
    sessionStorage.removeItem("deliveryLocation");
    sessionStorage.removeItem("comments");
    sessionStorage.removeItem("costCenter");
    sessionStorage.clear();

    // Optionally call parent's onLogout if you want to do something else
    // onLogout();

    // Redirect to the home or login page
    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  };

  // Keep your internal go-back logic
  const handleGoBackLocal = () => {
    // Or call onGoBack() from the parent
    // onGoBack();
    window.location.href = "/";
  };

  return (
    <header className="fixed top-0 z-10 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container flex items-center justify-between py-4">
        {/* Left side: logo + user name */}
        <div className="flex items-center gap-6">
          <img
            src="/lovable-uploads/70d83c98-5a0d-49cd-854d-2029b792990b.png"
            alt="Fundació Puigvert"
            className="h-12"
          />
          {userToShow && (
            <div className="hidden sm:block">
              <span className="text-sm font-medium text-gray-700">
                {userToShow.fullName}
              </span>
            </div>
          )}
        </div>

        {/* Centered title (same style as Header.tsx) */}
        <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-primary">
          Material d'Oficina
        </h1>

        {/* Right side: "Go back" and "Logout" buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={handleGoBackLocal}
            className="ml-2 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Tornar a la selecció de productes
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="ml-2">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
