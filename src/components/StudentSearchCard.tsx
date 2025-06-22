
import React from 'react';
import { Button } from "@/components/ui/button";

interface StudentSearchResult {
  id: string;
  name: string;
  email: string;
}

interface StudentSearchCardProps {
  result: StudentSearchResult;
  onSendFriendRequest: (friendId: string) => void;
  isSending: boolean;
}

const StudentSearchCard: React.FC<StudentSearchCardProps> = ({
  result,
  onSendFriendRequest,
  isSending
}) => {
  return (
    <div className="flex items-center justify-between p-2 border rounded-md">
      <div>
        <p className="font-medium">{result.name}</p>
        <p className="text-xs text-muted-foreground">{result.email}</p>
      </div>
      <Button 
        size="sm" 
        variant="outline"
        onClick={() => onSendFriendRequest(result.id)}
        disabled={isSending}
      >
        {isSending ? 'Enviando...' : 'Adicionar'}
      </Button>
    </div>
  );
};

export default StudentSearchCard;
