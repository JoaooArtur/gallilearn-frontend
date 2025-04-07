import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { apiService } from '@/services/api.service';

interface SignUpData {
  name: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth: Date | undefined;
}

const formatPhoneNumber = (value: string): string => {
  if (!value) return value;
  
  const phoneNumber = value.replace(/\D/g, '');
  
  if (phoneNumber.length <= 2) {
    return `(${phoneNumber}`;
  } else if (phoneNumber.length <= 6) {
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
  } else if (phoneNumber.length <= 10) {
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 6)}-${phoneNumber.slice(6)}`;
  } else {
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`;
  }
};

const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState<SignUpData>({ 
    name: '', 
    email: '', 
    password: '',
    phone: '',
    dateOfBirth: undefined
  });
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [phoneInputValue, setPhoneInputValue] = useState('');

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      await login(loginData.email, loginData.password);
      
      toast({
        title: "Login realizado",
        description: "Bem-vindo de volta ao AstroQuest!",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: "Falha no login",
        description: "Email ou senha incorretos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    
    if (!registerData.dateOfBirth) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, informe sua data de nascimento.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const signUpBody = {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        phone: registerData.phone,
        dateOfBirth: registerData.dateOfBirth.toISOString()
      };

      const response = await apiService.post('/students/sign-up', signUpBody);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      toast({
        title: "Conta criada",
        description: "Bem-vindo ao AstroQuest! Por favor, faça login para continuar.",
      });
      
      setRegisterData({ 
        name: '', 
        email: '', 
        password: '',
        phone: '',
        dateOfBirth: undefined
      });
      
      setLoginData({
        email: registerData.email,
        password: ''
      });
      
      const loginTab = document.querySelector('[data-value="login"]');
      if (loginTab) {
        (loginTab as HTMLElement).click();
      }
    } catch (error) {
      console.error('Registration failed:', error);
      toast({
        title: "Falha no registro",
        description: "Não foi possível criar sua conta. Por favor tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setPhoneInputValue(formattedPhone);
    
    const phoneDigits = formattedPhone.replace(/\D/g, '');
    setRegisterData({ ...registerData, phone: phoneDigits });
  };

  const goToPreviousYear = () => {
    setCurrentYear(prevYear => prevYear - 1);
  };

  const goToNextYear = () => {
    const nextYear = currentYear + 1;
    if (nextYear <= new Date().getFullYear()) {
      setCurrentYear(nextYear);
    }
  };

  const fromYear = Math.max(1900, currentYear - 100);
  const toYear = Math.min(new Date().getFullYear(), currentYear + 100);
  
  return (
    <Card className="w-full max-w-md mx-auto bg-card/80 backdrop-blur-sm border border-astro-nebula-pink/20">
      <Tabs defaultValue="login">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login" data-value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Registro</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Entre na sua conta para continuar sua jornada espacial</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="seu@email.com" 
                  required 
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Senha</label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
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
          <form onSubmit={handleRegister}>
            <CardHeader>
              <CardTitle>Criar Conta</CardTitle>
              <CardDescription>Embarque em uma jornada pelo cosmos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Nome</label>
                <Input 
                  id="name" 
                  placeholder="Seu nome completo" 
                  required 
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">Telefone</label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="(00) 00000-0000" 
                  required 
                  value={phoneInputValue}
                  onChange={handlePhoneChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="birthdate" className="text-sm font-medium">Data de Nascimento</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="birthdate"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !registerData.dateOfBirth && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {registerData.dateOfBirth ? (
                        format(registerData.dateOfBirth, "dd/MM/yyyy")
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="flex justify-between items-center p-2 border-b">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={goToPreviousYear}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="font-medium">{currentYear}</div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={goToNextYear}
                        disabled={currentYear >= new Date().getFullYear()}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <Calendar
                      mode="single"
                      selected={registerData.dateOfBirth}
                      onSelect={(date) => setRegisterData({ ...registerData, dateOfBirth: date })}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                      fromYear={fromYear}
                      toYear={toYear}
                      captionLayout="buttons"
                      defaultMonth={currentYear ? new Date(currentYear, 0) : undefined}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="seu@email.com" 
                  required 
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Senha</label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                />
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
