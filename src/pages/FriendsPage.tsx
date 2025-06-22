
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import StarField from '@/components/StarField';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { userService } from '@/services/user.service';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import FriendSearchForm from '@/components/FriendSearchForm';
import FriendRequestsList from '@/components/FriendRequestsList';
import FriendsGrid from '@/components/FriendsGrid';

const FriendsPage = () => {
  const { studentId } = useAuth();
  
  // Get friends data using studentId from AuthContext
  const { data: friends = [], isLoading: isLoadingFriends } = useQuery({
    queryKey: ['friends', studentId],
    queryFn: () => {
      if (!studentId) {
        toast.error('User ID not available');
        return [];
      }
      return userService.getStudentFriends(studentId);
    },
    enabled: !!studentId,
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to load friends', {
          description: error.message || 'Please try again later'
        });
      }
    }
  });
  
  // Get friend requests using the studentId from AuthContext
  const { data: friendRequests = [], isLoading: isLoadingRequests } = useQuery({
    queryKey: ['friendRequests', studentId],
    queryFn: () => {
      if (!studentId) {
        toast.error('User ID not available');
        return [];
      }
      return userService.getFriendRequests(studentId);
    },
    enabled: !!studentId,
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to load friend requests', {
          description: error.message || 'Please try again later'
        });
      }
    }
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
            <FriendSearchForm />
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
            <FriendsGrid friends={friends} isLoading={isLoadingFriends} />
          </TabsContent>
          
          <TabsContent value="requests">
            <FriendRequestsList 
              friendRequests={friendRequests} 
              isLoading={isLoadingRequests} 
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default FriendsPage;
