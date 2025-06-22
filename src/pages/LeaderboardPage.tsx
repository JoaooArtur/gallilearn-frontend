
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import StarField from '@/components/StarField';
import LeaderboardCard from '@/components/LeaderboardCard';
import { Link } from 'react-router-dom';
import { userService, CURRENT_STUDENT_ID } from '@/services/user.service';
import { toast } from 'sonner';

const LeaderboardPage = () => {
  // Get current student profile
  const { data: studentProfile } = useQuery({
    queryKey: ['studentProfile'],
    queryFn: () => userService.getCurrentStudent(),
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to load profile', {
          description: error.message || 'Please try again later'
        });
      }
    }
  });

  // Get student's friends
  const { data: friends, isLoading } = useQuery({
    queryKey: ['friendsRanking'],
    queryFn: () => userService.getStudentFriends(CURRENT_STUDENT_ID),
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to load friends ranking', {
          description: error.message || 'Please try again later'
        });
      }
    }
  });

  // Prepare friends ranking data with current user
  const prepareFriendsRanking = () => {
    if (!friends || !studentProfile) return [];
    
    // Combine friends with current user
    const allUsers = [
      ...friends.map(friend => ({
        id: friend.id,
        name: friend.name,
        avatar: '',
        xp: friend.xp || 0,
        level: friend.level,
        position: 0, // Will be set after sorting
        isCurrentUser: false
      })),
      {
        id: studentProfile.id,
        name: studentProfile.name,
        avatar: '',
        xp: studentProfile.xp || 0,
        level: studentProfile.level,
        position: 0, // Will be set after sorting
        isCurrentUser: true
      }
    ];
    
    // Sort by level first, then by XP
    const sortedUsers = allUsers.sort((a, b) => {
      if (b.level !== a.level) return b.level - a.level;
      return b.xp - a.xp;
    });
    
    // Add positions
    return sortedUsers.map((user, index) => ({
      ...user,
      position: index + 1
    }));
  };
  
  const friendsRanking = prepareFriendsRanking();
  
  return (
    <div className="min-h-screen pb-16">
      <StarField />
      <NavBar />
      
      <main className="container pt-24">
        <div className="mb-8">
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block">
            ← Voltar para Dashboard
          </Link>
          
          <h1 className="text-3xl font-bold text-center mb-2">Ranking de Amigos</h1>
          <p className="text-center text-muted-foreground mb-8">
            Compare seu progresso com seus amigos
          </p>
          
          <div className="w-full max-w-lg mx-auto">
            {isLoading ? (
              <div className="flex justify-center p-6">
                <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              </div>
            ) : friendsRanking.length > 0 ? (
              <LeaderboardCard users={friendsRanking} timeFrame="all-time" />
            ) : (
              <div className="text-center p-6 border border-dashed rounded-lg">
                <p className="text-muted-foreground mb-4">Você ainda não possui amigos. Adicione alguns amigos para ver o ranking!</p>
                <Link to="/friends">
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                    Ver Amigos
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeaderboardPage;
