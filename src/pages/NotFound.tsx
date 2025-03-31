
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import StarField from "@/components/StarField";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      <StarField />
      
      <div className="text-center z-10">
        <h1 className="text-9xl font-bold text-astro-nebula-pink">404</h1>
        <div className="w-16 h-16 mx-auto my-6 relative">
          <div className="absolute w-full h-full rounded-full bg-astro-black-hole animate-pulse-star"></div>
          <div className="absolute w-full h-full flex items-center justify-center">
            <div className="w-8 h-1 bg-astro-nebula-pink rounded-full"></div>
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4">Buraco Negro Encontrado</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
          Esta página foi sugada por um buraco negro e não pode ser encontrada no nosso universo.
        </p>
        
        <Link to="/dashboard">
          <Button size="lg">
            Voltar ao seu Universo
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
