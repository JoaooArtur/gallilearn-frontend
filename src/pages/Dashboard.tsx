
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import StarField from '@/components/StarField';
import SubjectCard from '@/components/SubjectCard';
import ProgressBar from '@/components/ProgressBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { subjectsService } from '@/services/subjects.service';
import { userService, CURRENT_STUDENT_ID } from '@/services/user.service';
import { toast } from 'sonner';

const Dashboard = () => {
  // Get student profile data
  const { data: studentProfile, isLoading: isLoadingProfile } = useQuery({
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

  // Get student subjects for dashboard
  const { data: studentSubjects, isLoading: isLoadingSubjects, isError } = useQuery({
    queryKey: ['studentSubjects'],
    queryFn: () => subjectsService.getStudentSubjects(),
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to load subjects', {
          description: error.message || 'Please try again later'
        });
      }
    }
  });

  // Get student's friends
  const { data: friends } = useQuery({
    queryKey: ['friendsRanking'],
    queryFn: () => userService.getStudentFriends(CURRENT_STUDENT_ID),
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to load friends', {
          description: error.message || 'Please try again later'
        });
      }
    }
  });

  // Mock icons for subjects
  const getIconForSubject = (index: number) => {
    const icons = ['🌌', '🪐', '✨', '🔭', '⚡', '🌍'];
    return icons[index % icons.length];
  };

  // Convert API subjects to the format expected by SubjectCard
  const mapSubjectToCardProps = (studentSubject: any, index: number) => ({
    id: studentSubject.subject.id,
    title: studentSubject.subject.name,
    description: studentSubject.subject.description,
    completed: studentSubject.lessons.finishedLessons,
    total: studentSubject.lessons.totalLessons,
    icon: getIconForSubject(index)
  });

  // Prepare friend ranking data - adding current user to the list
  const prepareFriendRanking = () => {
    if (!friends || !studentProfile) return [];
    
    // Combine friends with current user
    const allUsers = [
      ...friends,
      {
        id: studentProfile.id,
        name: studentProfile.name,
        level: studentProfile.level,
        daysStreak: studentProfile.daysStreak,
        isCurrentUser: true,
        xp: studentProfile.xp, // Add XP for sorting
      }
    ];
    
    // Sort by level and XP (assuming higher level and XP means higher ranking)
    return allUsers
      .sort((a, b) => {
        if (b.level !== a.level) return b.level - a.level;
        // If same level, try to sort by XP if available
        return (b as any).xp || 0 - (a as any).xp || 0;
      })
      .slice(0, 4); // Get top 4
  };
  
  const friendRanking = prepareFriendRanking();
  
  const isLoading = isLoadingProfile || isLoadingSubjects;
  
  return (
    <div className="min-h-screen pb-16">
      <StarField />
      <NavBar />
      
      <main className="container pt-24">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold mb-2">Olá, {studentProfile?.name || 'Astronauta'}!</h1>
          <p className="text-muted-foreground">
            Continue sua jornada pelo cosmos. Você está há <span className="text-astro-meteor-orange font-bold">{studentProfile?.daysStreak || 0} dias</span> consecutivos aprendendo!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Daily progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progresso Diário</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <ProgressBar 
                  value={studentProfile?.xp || 0} 
                  max={50} // Daily goal - could be dynamic in the future
                  label="XP Hoje" 
                />
              </div>
              <Button className="w-full">
                Completar Meta Diária
              </Button>
            </CardContent>
          </Card>
          
          {/* Level progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nível {studentProfile?.level || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <ProgressBar 
                  value={studentProfile?.xp || 0} 
                  max={studentProfile?.nextLevelXPNeeded || 100} 
                  label="Progresso para o próximo nível" 
                />
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Faltam {(studentProfile?.nextLevelXPNeeded || 100) - (studentProfile?.xp || 0)} XP para o nível {(studentProfile?.level || 0) + 1}
              </div>
            </CardContent>
          </Card>
          
          {/* Friend ranking */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ranking de Amigos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {friendRanking.map((friend, index) => (
                  <div 
                    key={friend.id}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      (friend as any).isCurrentUser ? 'bg-astro-nebula-pink/20 border border-astro-nebula-pink/30' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                        {index + 1}
                      </div>
                      <span>{friend.name}</span>
                    </div>
                    <span className="text-astro-star-gold">Nível {friend.level}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link to="/friends">
                  <Button variant="outline" className="w-full">Ver Amigos</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-2xl font-bold mb-6">Seus Assuntos</h2>
        
        {isLoading ? (
          <div className="flex justify-center p-6">
            <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
        ) : isError ? (
          <div className="text-center p-6">
            <p className="text-destructive mb-4">Não foi possível carregar os assuntos.</p>
            <Button onClick={() => window.location.reload()} variant="outline">Tentar novamente</Button>
          </div>
        ) : studentSubjects && studentSubjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentSubjects.map((subject, index) => (
              <SubjectCard 
                key={subject.subject.id}
                {...mapSubjectToCardProps(subject, index)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-6 border border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">Você ainda não possui assuntos. Comece a explorar agora!</p>
            <Link to="/subjects">
              <Button>Explorar Assuntos</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
