
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { LogIn } from 'lucide-react';

const AuthForm = () => {
  const { login, isLoading } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login();
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card/80 backdrop-blur-sm border border-astro-nebula-pink/20">
      <CardHeader>
        <CardTitle>Boas-vindas ao AstroQuest</CardTitle>
        <CardDescription>Entre para começar sua jornada espacial</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-6">
        <form onSubmit={handleLogin} className="w-full">
          <Button 
            type="submit" 
            className="w-full mt-4"
            disabled={isLoading}
            size="lg"
          >
            <LogIn className="mr-2 h-4 w-4" />
            {isLoading ? "Conectando..." : "Entrar com Auth0"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center text-center">
        <p className="text-xs text-muted-foreground">
          Ao fazer login, você concorda com nossos Termos de Serviço e Política de Privacidade.
        </p>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
