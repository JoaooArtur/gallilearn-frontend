
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import FriendRequestCard from './FriendRequestCard';

interface FriendRequest {
  id: string;
  studentId: string;
  friendId: string;
  status: string;
  createdAt: string;
  friend?: {
    id: string;
    name: string;
    email: string;
    level?: number;
  };
}

interface FriendRequestsListProps {
  friendRequests: FriendRequest[];
  isLoading: boolean;
}

const FriendRequestsList: React.FC<FriendRequestsListProps> = ({
  friendRequests,
  isLoading
}) => {
  const { studentId } = useAuth();
  const queryClient = useQueryClient();
  
  // Accept friend request mutation
  const acceptFriendMutation = useMutation({
    mutationFn: ({ requestId }: { requestId: string }) => {
      if (!studentId) {
        throw new Error('User ID not available');
      }
      return userService.acceptFriendRequest(studentId, requestId);
    },
    onSuccess: () => {
      toast.success('Friend request accepted');
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to accept friend request', {
        description: error.message || 'Please try again later'
      });
    }
  });

  // Reject friend request mutation
  const rejectFriendMutation = useMutation({
    mutationFn: ({ requestId }: { requestId: string }) => {
      if (!studentId) {
        throw new Error('User ID not available');
      }
      return userService.rejectFriendRequest(studentId, requestId);
    },
    onSuccess: () => {
      toast.success('Friend request rejected');
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to reject friend request', {
        description: error.message || 'Please try again later'
      });
    }
  });
  
  const handleAcceptRequest = (requestId: string) => {
    acceptFriendMutation.mutate({ requestId });
  };
  
  const handleRejectRequest = (requestId: string) => {
    rejectFriendMutation.mutate({ requestId });
  };

  const isProcessing = acceptFriendMutation.isPending || rejectFriendMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex justify-center p-6">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (friendRequests.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Você não tem solicitações de amizade pendentes</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {friendRequests.map((request) => (
        <FriendRequestCard
          key={request.id}
          request={request}
          onAccept={handleAcceptRequest}
          onReject={handleRejectRequest}
          isProcessing={isProcessing}
          acceptingRequestId={acceptFriendMutation.variables?.requestId}
          rejectingRequestId={rejectFriendMutation.variables?.requestId}
        />
      ))}
    </div>
  );
};

export default FriendRequestsList;
