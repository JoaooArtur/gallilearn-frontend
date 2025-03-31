
import React from 'react';
import NavBar from '@/components/NavBar';
import StarField from '@/components/StarField';
import FriendCard from '@/components/FriendCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';

// Dados de exemplo para os amigos
const mockFriends = [
  { id: '1', name: 'Lucas', avatar: '', level: 6, streak: 7, xp: 420, nextLevelXp: 600 },
  { id: '2', name: 'Marina', avatar: '', level: 5, streak: 4, xp: 385, nextLevelXp: 500 },
  { id: '3', name: 'João', avatar: '', level: 4, streak: 2, xp: 310, nextLevelXp: 400 },
  { id: '4', name: 'Ana', avatar: '', level: 3, streak: 1, xp: 240, nextLevelXp: 300 },
];

// Dados de exemplo para solicitações de amizade
const mockFriendRequests = [
  { id: '5', name: 'Pedro', avatar: '', level: 7, streak: 12, xp: 720, nextLevelXp: 800 },
  { id: '6', name: 'Juliana', avatar: '', level: 2, streak: 3, xp: 180, nextLevelXp: 200 },
];

const FriendsPage = () => {
  return (
    <div className="min-h-screen pb-16">
      <StarField />
      <NavBar />
      
      <main className="container pt-24">
        <div className="mb-8">
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block">
            ← Voltar para Dashboard
          </Link>
          
          <h1 className="text-3xl font-bold text-center mb-2">Seus Amigos</h1>
          <p className="text-center text-muted-foreground mb-8">
            Explore o cosmos com seus amigos e acompanhe o progresso deles
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Amigos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex w-full items-center space-x-2">
                  <Input placeholder="Procurar por nome ou email" />
                  <Button type="submit">Procurar</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Solicitações</CardTitle>
              </CardHeader>
              <CardContent>
                {mockFriendRequests.length > 0 ? (
                  <p className="text-sm">{mockFriendRequests.length} pendente(s)</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhuma solicitação pendente</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Tabs defaultValue="friends">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="friends">Seus Amigos</TabsTrigger>
            <TabsTrigger value="requests">
              Solicitações
              {mockFriendRequests.length > 0 && (
                <span className="ml-2 bg-astro-nebula-pink text-white px-2 py-0.5 rounded-full text-xs">
                  {mockFriendRequests.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="friends">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockFriends.map((friend) => (
                <FriendCard 
                  key={friend.id}
                  id={friend.id}
                  name={friend.name}
                  avatar={friend.avatar}
                  level={friend.level}
                  streak={friend.streak}
                  xp={friend.xp}
                  nextLevelXp={friend.nextLevelXp}
                />
              ))}
            </div>
            
            {mockFriends.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Você ainda não tem amigos na plataforma</p>
                <Button>Procurar Amigos</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="requests">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockFriendRequests.map((request) => (
                <Card key={request.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-astro-cosmic-purple flex items-center justify-center text-lg font-bold">
                        {request.name.substring(0, 1)}
                      </div>
                      <div>
                        <h4 className="font-medium">{request.name}</h4>
                        <p className="text-sm text-muted-foreground">Nível {request.level}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" className="flex-1">Recusar</Button>
                      <Button className="flex-1">Aceitar</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {mockFriendRequests.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Você não tem solicitações de amizade pendentes</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default FriendsPage;
