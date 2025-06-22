
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { userService } from '@/services/user.service';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import StudentSearchCard from './StudentSearchCard';

const FriendSearchForm: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { studentId } = useAuth();
  const queryClient = useQueryClient();
  
  // Send friend request mutation
  const sendFriendRequestMutation = useMutation({
    mutationFn: ({ friendId }: { friendId: string }) => {
      if (!studentId) {
        throw new Error('User ID not available');
      }
      return userService.sendFriendRequest(studentId, friendId);
    },
    onSuccess: () => {
      toast.success('Solicitação de amizade enviada');
      queryClient.invalidateQueries({ queryKey: ['searchStudents'] });
    },
    onError: (error: Error) => {
      toast.error('Falha ao enviar solicitação de amizade', {
        description: error.message || 'Tente novamente mais tarde'
      });
    }
  });
  
  // Search for students
  const { data: searchResults = [], isLoading: isSearching } = useQuery({
    queryKey: ['searchStudents', searchTerm],
    queryFn: () => userService.searchStudents(searchTerm),
    enabled: searchTerm.length >= 2,
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to search students', {
          description: error.message || 'Please try again later'
        });
      }
    }
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };
  
  const handleSendFriendRequest = (friendId: string) => {
    sendFriendRequestMutation.mutate({ friendId });
  };

  return (
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
              <StudentSearchCard
                key={result.id}
                result={result}
                onSendFriendRequest={handleSendFriendRequest}
                isSending={sendFriendRequestMutation.isPending}
              />
            ))}
          </div>
        )}
        
        {searchTerm.length >= 2 && !isSearching && searchResults.length === 0 && (
          <p className="mt-2 text-sm text-muted-foreground">Nenhum usuário encontrado</p>
        )}
      </CardContent>
    </Card>
  );
};

export default FriendSearchForm;
