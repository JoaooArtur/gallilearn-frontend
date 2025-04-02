
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import StarField from '@/components/StarField';
import FriendCard from '@/components/FriendCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { userService } from '@/services/user.service';
import { toast } from 'sonner';

const FriendsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get friends data
  const { data: friends = [], isLoading: isLoadingFriends } = useQuery({
    queryKey: ['friends'],
    queryFn: () => userService.getStudentFriends(),
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to load friends', {
          description: error.message || 'Please try again later'
        });
      }
    }
  });
  
  // Get friend requests
  const { data: friendRequests = [], isLoading: isLoadingRequests } = useQuery({
    queryKey: ['friendRequests'],
    queryFn: () => userService.getFriendRequests(),
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to load friend requests', {
          description: error.message || 'Please try again later'
        });
      }
    }
  });
  
  // Search for students
  const { data: searchResults = [], isLoading: isSearching } = useQuery({
    queryKey: ['searchStudents', searchTerm],
    queryFn: () => userService.searchStudents(searchTerm),
    enabled: searchTerm.length >= 2, // Only search when at least 2 characters are entered
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to search students', {
          description: error.message || 'Please try again later'
        });
      }
    }
  });
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is triggered automatically by the useQuery hook
  };
  
  // Format friend data for the FriendCard component
  const formatFriendData = (friend: any) => ({
    id: friend.id,
    name: friend.name,
    avatar: '', // No avatar data from API yet
    level: friend.level,
    streak: friend.daysStreak,
    xp: 0, // No XP data in the friends API response
    nextLevelXp: 100, // Placeholder value
  });
  
  const isLoading = isLoadingFriends || isLoadingRequests;
  
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
                <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
                  <Input 
                    placeholder="Procurar por nome ou email" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button type="submit" disabled={isSearching}>
                    {isSearching ? 'Buscando...' : 'Procurar'}
                  </Button>
                </form>
                
                {searchTerm.length >= 2 && searchResults.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium">Resultados da Pesquisa</p>
                    {searchResults.map((result) => (
                      <div key={result.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div>
                          <p className="font-medium">{result.name}</p>
                          <p className="text-xs text-muted-foreground">{result.email}</p>
                        </div>
                        <Button size="sm" variant="outline">Adicionar</Button>
                      </div>
                    ))}
                  </div>
                )}
                
                {searchTerm.length >= 2 && !isSearching && searchResults.length === 0 && (
                  <p className="mt-2 text-sm text-muted-foreground">Nenhum usuário encontrado</p>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Solicitações</CardTitle>
              </CardHeader>
              <CardContent>
                {friendRequests.length > 0 ? (
                  <p className="text-sm">{friendRequests.length} pendente(s)</p>
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
              {friendRequests.length > 0 && (
                <span className="ml-2 bg-astro-nebula-pink text-white px-2 py-0.5 rounded-full text-xs">
                  {friendRequests.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="friends">
            {isLoading ? (
              <div className="flex justify-center p-6">
                <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {friends.map((friend) => (
                  <FriendCard 
                    key={friend.id}
                    {...formatFriendData(friend)}
                  />
                ))}
              </div>
            )}
            
            {!isLoading && friends.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Você ainda não tem amigos na plataforma</p>
                <Button>Procurar Amigos</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="requests">
            {isLoading ? (
              <div className="flex justify-center p-6">
                <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {friendRequests.map((request) => (
                  <Card key={request.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-astro-cosmic-purple flex items-center justify-center text-lg font-bold">
                          ?
                        </div>
                        <div>
                          <h4 className="font-medium">Solicitação de amizade</h4>
                          <p className="text-sm text-muted-foreground">ID: {request.id.substring(0, 8)}...</p>
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
            )}
            
            {!isLoading && friendRequests.length === 0 && (
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
