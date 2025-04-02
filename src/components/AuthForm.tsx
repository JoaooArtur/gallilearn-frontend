
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent, type: 'login' | 'register') => {
    event.preventDefault();
    setIsLoading(true);
    
    // Simulação de login/registro
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: type === 'login' ? "Login realizado" : "Conta criada",
        description: type === 'login' 
          ? "Bem-vindo de volta ao AstroQuest!"
          : "Bem-vindo ao AstroQuest! Explore o universo com a gente.",
      });
      // Em uma implementação real, redirecionaríamos para o dashboard
      window.location.href = '/dashboard';
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card/80 backdrop-blur-sm border border-astro-nebula-pink/20">
      <Tabs defaultValue="login">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Registro</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <form onSubmit={(e) => handleSubmit(e, 'login')}>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Entre na sua conta para continuar sua jornada espacial</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input id="email" type="email" placeholder="seu@email.com" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Senha</label>
                <Input id="password" type="password" placeholder="••••••••" required />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
        
        <TabsContent value="register">
          <form onSubmit={(e) => handleSubmit(e, 'register')}>
            <CardHeader>
              <CardTitle>Criar Conta</CardTitle>
              <CardDescription>Embarque em uma jornada pelo cosmos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Nome</label>
                <Input id="name" placeholder="Seu nome" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input id="email" type="email" placeholder="seu@email.com" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Senha</label>
                <Input id="password" type="password" placeholder="••••••••" required />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Criando conta..." : "Criar Conta"}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AuthForm;
