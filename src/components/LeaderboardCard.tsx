
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LeaderboardUser {
  id: string;
  name: string;
  avatar?: string;
  xp: number;
  level: number;
  position: number;
  isCurrentUser?: boolean;
}

interface LeaderboardCardProps {
  users: LeaderboardUser[];
  timeFrame: 'day' | 'week' | 'all-time';
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ users, timeFrame }) => {
  const timeFrameText = {
    'day': 'Hoje',
    'week': 'Esta Semana',
    'all-time': 'Geral'
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{timeFrameText[timeFrame]}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {users.map((user) => (
            <div 
              key={user.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                user.isCurrentUser 
                  ? 'bg-astro-nebula-pink/20 border border-astro-nebula-pink/30' 
                  : 'hover:bg-muted/30 cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  user.position <= 3 
                    ? 'bg-astro-star-gold text-astro-black-hole' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {user.position}
                </div>
                
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="bg-astro-cosmic-purple text-primary-foreground">
                    {user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h4 className="font-medium">{user.name}</h4>
                  <p className="text-xs text-muted-foreground">Nível {user.level}</p>
                </div>
              </div>
              
              <div className="font-bold text-astro-star-gold">
                {user.xp} XP
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardCard;
