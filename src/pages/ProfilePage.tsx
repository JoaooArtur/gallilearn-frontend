
import React from 'react';
import NavBar from '@/components/NavBar';
import StarField from '@/components/StarField';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import UserProfile from '@/components/UserProfile';

const ProfilePage = () => {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="min-h-screen">
        <StarField />
        <NavBar />
        <main className="container pt-24 text-center">
          <p>Você precisa estar logado para acessar esta página.</p>
          <Link to="/" className="text-primary hover:underline">Voltar para login</Link>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pb-16">
      <StarField />
      <NavBar />
      
      <main className="container pt-24">
        <div className="mb-8">
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block">
            ← Voltar para Dashboard
          </Link>
          
          <h1 className="text-3xl font-bold text-center mb-2">Seu Perfil</h1>
          <p className="text-center text-muted-foreground mb-8">
            Gerencie suas informações pessoais e acompanhe seu progresso
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4">
            <Card>
              <CardHeader className="pb-0">
                <h2 className="text-xl font-semibold">Suas Informações</h2>
              </CardHeader>
              <CardContent>
                <UserProfile 
                  name={user.name}
                  email={user.email}
                  level={5}
                  progress={75}
                  streak={7}
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-8">
            <Card className="mb-6">
              <CardHeader className="pb-0">
                <h2 className="text-xl font-semibold">Estatísticas</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-3xl font-bold text-primary">7</p>
                    <p className="text-sm text-muted-foreground">Dias consecutivos</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-3xl font-bold text-primary">12</p>
                    <p className="text-sm text-muted-foreground">Lições completadas</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-3xl font-bold text-primary">1250</p>
                    <p className="text-sm text-muted-foreground">Pontos XP</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-0">
                <h2 className="text-xl font-semibold">Configurações</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <p className="font-medium">Notificações</p>
                  <p className="text-sm text-muted-foreground">
                    Gerencie como e quando você recebe notificações
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="font-medium">Privacidade</p>
                  <p className="text-sm text-muted-foreground">
                    Controle quem pode ver seu perfil e progresso
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="font-medium">Conta</p>
                  <p className="text-sm text-muted-foreground">
                    Gerencie as configurações da sua conta
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
