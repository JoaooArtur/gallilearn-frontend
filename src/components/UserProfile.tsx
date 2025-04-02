
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import ProgressBar from './ProgressBar';

interface UserProfileProps {
  name: string;
  email?: string;
  username?: string;
  avatar?: string;
  level: number;
  xp?: number;
  nextLevelXp?: number;
  progress?: number;
  streak: number;
  subjects?: number;
  completedLessons?: number;
  badges?: { id: string; name: string; icon: string }[];
}

const UserProfile: React.FC<UserProfileProps> = ({
  name,
  email,
  username,
  avatar,
  level,
  xp = 0,
  nextLevelXp = 100,
  progress = 0,
  streak,
  subjects = 0,
  completedLessons = 0,
  badges = []
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-astro-cosmic-purple via-astro-nebula-pink to-astro-planet-teal" />
      <CardHeader className="pt-0 relative">
        <div className="absolute -top-12 left-6">
          <Avatar className="h-24 w-24 border-4 border-background">
            <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
            <AvatarFallback className="text-2xl bg-astro-cosmic-purple text-primary-foreground">
              {name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="pt-16">
          <CardTitle>{name}</CardTitle>
          {username && <p className="text-muted-foreground">@{username}</p>}
          {email && <p className="text-muted-foreground text-sm">{email}</p>}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-muted/40 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-astro-star-gold">{level}</div>
            <div className="text-xs text-muted-foreground">Nível</div>
          </div>
          
          <div className="bg-muted/40 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-astro-meteor-orange">{streak}</div>
            <div className="text-xs text-muted-foreground">Dias Seguidos</div>
          </div>
          
          <div className="bg-muted/40 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-astro-nebula-pink">{completedLessons}</div>
            <div className="text-xs text-muted-foreground">Lições</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>XP</span>
            <span>{xp}/{nextLevelXp}</span>
          </div>
          <ProgressBar value={xp} max={nextLevelXp} />
        </div>
        
        {badges.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Conquistas</h3>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <Badge key={badge.id} variant="outline" className="px-3 py-1 bg-muted/30">
                  <span className="mr-1">{badge.icon}</span> {badge.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfile;
