
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FriendRequestCardProps {
  request: {
    id: string;
    friendId: string;
    friend?: {
      id: string;
      name: string;
      email: string;
      level?: number;
    };
  };
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
  isProcessing: boolean;
  acceptingRequestId?: string;
  rejectingRequestId?: string;
}

const FriendRequestCard: React.FC<FriendRequestCardProps> = ({
  request,
  onAccept,
  onReject,
  isProcessing,
  acceptingRequestId,
  rejectingRequestId
}) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-astro-cosmic-purple flex items-center justify-center text-lg font-bold">
            {request.friend?.name ? request.friend.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div className="flex-1">
            <h4 className="font-medium">{request.friend?.name || 'Unknown User'}</h4>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">{request.friend?.email || `ID: ${request.friendId.substring(0, 8)}...`}</p>
              {request.friend?.level && (
                <span className="px-2 py-1 bg-astro-nebula-pink/20 text-astro-nebula-pink rounded-full text-xs font-medium">
                  Nível {request.friend.level}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={() => onReject(request.id)}
            disabled={isProcessing}
          >
            {rejectingRequestId === request.id 
              ? 'Rejeitando...' 
              : 'Recusar'}
          </Button>
          <Button 
            className="flex-1"
            onClick={() => onAccept(request.id)}
            disabled={isProcessing}
          >
            {acceptingRequestId === request.id 
              ? 'Aceitando...' 
              : 'Aceitar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FriendRequestCard;
