
import React from 'react';
import { Button } from '@/components/ui/button';
import FriendCard from './FriendCard';

interface Friend {
  id: string;
  name: string;
  level: number;
  daysStreak: number;
  xp: number;
}

interface FriendsGridProps {
  friends: Friend[];
  isLoading: boolean;
}

const FriendsGrid: React.FC<FriendsGridProps> = ({ friends, isLoading }) => {
  // Format friend data for the FriendCard component
  const formatFriendData = (friend: Friend) => ({
    id: friend.id,
    name: friend.name,
    avatar: '',
    level: friend.level,
    streak: friend.daysStreak,
    xp: 0,
    nextLevelXp: 100,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-6">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Você ainda não tem amigos na plataforma</p>
        <Button>Procurar Amigos</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {friends.map((friend) => (
        <FriendCard 
          key={friend.id}
          {...formatFriendData(friend)}
        />
      ))}
    </div>
  );
};

export default FriendsGrid;
