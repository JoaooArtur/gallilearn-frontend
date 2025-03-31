
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import StarField from '@/components/StarField';
import UserProfile from '@/components/UserProfile';
import SubjectCard from '@/components/SubjectCard';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { subjectsService } from '@/services/subjects.service';
import { toast } from 'sonner';

// Dados de exemplo para a página de perfil
const mockUserData = {
  name: 'Astronauta',
  username: 'astronauta123',
  level: 5,
  xp: 350,
  nextLevelXp: 500,
  streak: 3,
  subjects: 3,
  completedLessons: 2,
  badges: [
    { id: '1', name: 'Primeiro login', icon: '🚀' },
    { id: '2', name: '3 dias seguidos', icon: '🔥' },
    { id: '3', name: 'Completou primeira lição', icon: '📚' },
  ],
  stats: {
    questionsAnswered: 35,
    correctAnswers: 28,
    accuracy: 80,
    averageTime: 25,
    bestSubject: 'Introdução à Astrofísica',
  }
};

const ProfilePage = () => {
  // Get student subjects for profile page
  const { data: studentSubjects, isLoading, isError } = useQuery({
    queryKey: ['profileSubjects'],
    queryFn: () => subjectsService.getStudentSubjects(),
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to load subjects', {
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

  return (
    <div className="min-h-screen pb-16">
      <StarField />
      <NavBar />
      
      <main className="container pt-24">
        <div className="mb-8">
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block">
            ← Voltar para Dashboard
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div>
            <UserProfile 
              name={mockUserData.name}
              username={mockUserData.username}
              level={mockUserData.level}
              xp={mockUserData.xp}
              nextLevelXp={mockUserData.nextLevelXp}
              streak={mockUserData.streak}
              subjects={studentSubjects?.length || 0}
              completedLessons={mockUserData.completedLessons}
              badges={mockUserData.badges}
            />
          </div>
          
          <div className="lg:col-span-2">
            <Tabs defaultValue="stats">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="stats">Estatísticas</TabsTrigger>
                <TabsTrigger value="progress">Progresso</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stats">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Perguntas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold">{mockUserData.stats.questionsAnswered}</p>
                          <p className="text-sm text-muted-foreground">Respondidas</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">{mockUserData.stats.correctAnswers}</p>
                          <p className="text-sm text-muted-foreground">Corretas</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Precisão</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <p className="text-3xl font-bold">{mockUserData.stats.accuracy}%</p>
                        <p className="text-sm text-muted-foreground">Taxa de acerto</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Tempo Médio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <p className="text-3xl font-bold">{mockUserData.stats.averageTime}s</p>
                        <p className="text-sm text-muted-foreground">Por pergunta</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Melhor Assunto</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <p className="font-medium">{mockUserData.stats.bestSubject}</p>
                        <p className="text-sm text-muted-foreground">Taxa de acerto mais alta</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="progress">
                <h2 className="text-xl font-bold mb-4">Seus Assuntos</h2>
                {isLoading ? (
                  <div className="flex justify-center p-6">
                    <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                  </div>
                ) : isError ? (
                  <div className="text-center p-6">
                    <p className="text-destructive mb-4">Não foi possível carregar os assuntos.</p>
                  </div>
                ) : studentSubjects && studentSubjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {studentSubjects.map((subject, index) => (
                      <SubjectCard 
                        key={subject.subject.id}
                        {...mapSubjectToCardProps(subject, index)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 border border-dashed rounded-lg">
                    <p className="text-muted-foreground">Você ainda não possui assuntos.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
