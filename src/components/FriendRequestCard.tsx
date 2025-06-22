
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    // Add these properties in case they come directly on the request object
    name?: string;
    level?: number;
    email?: string;
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
  // Get name from friend object or directly from request
  const friendName = request.friend?.name || request.name || 'Unknown User';
  // Get level from friend object or directly from request
  const friendLevel = request.friend?.level || request.level;
  // Get email from friend object or directly from request
  const friendEmail = request.friend?.email || request.email || `ID: ${request.friendId.substring(0, 8)}...`;

  console.log('Friend request data:', request); // Debug log to see the actual data structure

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-astro-cosmic-purple flex items-center justify-center text-lg font-bold">
            {friendName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium">{friendName}</h4>
              {friendLevel && (
                <Badge variant="secondary" className="bg-astro-nebula-pink/20 text-astro-nebula-pink">
                  Nível {friendLevel}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {friendEmail}
            </p>
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
