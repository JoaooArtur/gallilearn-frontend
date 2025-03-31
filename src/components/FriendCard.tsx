
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ProgressBar from './ProgressBar';

interface FriendCardProps {
  id: string;
  name: string;
  avatar?: string;
  level: number;
  streak: number;
  xp: number;
  nextLevelXp: number;
}

const FriendCard: React.FC<FriendCardProps> = ({
  id,
  name,
  avatar,
  level,
  streak,
  xp,
  nextLevelXp
}) => {
  return (
    <Card className="overflow-hidden hover:border-astro-nebula-pink/30 transition-all">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-astro-nebula-pink/30">
            <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
            <AvatarFallback className="bg-astro-cosmic-purple text-primary-foreground">
              {name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium">{name}</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 bg-astro-cosmic-purple/30 rounded-full">
                  Nível {level}
                </span>
                <span className="text-xs px-2 py-1 bg-astro-meteor-orange/30 rounded-full flex items-center">
                  🔥 {streak}
                </span>
              </div>
            </div>
            
            <ProgressBar value={xp} max={nextLevelXp} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FriendCard;
