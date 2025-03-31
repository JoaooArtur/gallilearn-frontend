
import React from 'react';
import NavBar from '@/components/NavBar';
import StarField from '@/components/StarField';
import SubjectCard from '@/components/SubjectCard';
import ProgressBar from '@/components/ProgressBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

// Dados de exemplo para a dashboard
const mockSubjects = [
  {
    id: '1',
    title: 'Introdução à Astrofísica',
    description: 'Conceitos fundamentais para entender o universo.',
    completed: 2,
    total: 5,
    icon: '🌌'
  },
  {
    id: '2',
    title: 'Sistema Solar',
    description: 'Explore os planetas, luas e outros objetos do nosso sistema solar.',
    completed: 0,
    total: 4,
    icon: '🪐'
  },
  {
    id: '3',
    title: 'Estrelas e Galáxias',
    description: 'Como as estrelas nascem, vivem e morrem, e a formação de galáxias.',
    completed: 0,
    total: 6,
    icon: '✨'
  }
];

const Dashboard = () => {
  // Em uma aplicação real, estes dados viriam de um contexto ou API
  const userStats = {
    name: 'Astronauta',
    streak: 3,
    dailyGoal: 50,
    completedToday: 30,
    level: 5,
    xp: 350,
    nextLevelXp: 500
  };
  
  // Ranking de amigos (mockado)
  const friendRanking = [
    { id: '1', name: 'Lucas', xp: 420, level: 6 },
    { id: '2', name: 'Marina', xp: 385, level: 5 },
    { id: '3', name: 'Você', xp: 350, level: 5, isCurrentUser: true },
    { id: '4', name: 'João', xp: 310, level: 4 },
  ];
  
  return (
    <div className="min-h-screen pb-16">
      <StarField />
      <NavBar />
      
      <main className="container pt-24">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold mb-2">Olá, {userStats.name}!</h1>
          <p className="text-muted-foreground">
            Continue sua jornada pelo cosmos. Você está há <span className="text-astro-meteor-orange font-bold">{userStats.streak} dias</span> consecutivos aprendendo!
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
                  value={userStats.completedToday} 
                  max={userStats.dailyGoal} 
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
              <CardTitle className="text-lg">Nível {userStats.level}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <ProgressBar 
                  value={userStats.xp} 
                  max={userStats.nextLevelXp} 
                  label="Progresso para o próximo nível" 
                />
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Faltam {userStats.nextLevelXp - userStats.xp} XP para o nível {userStats.level + 1}
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
                      friend.isCurrentUser ? 'bg-astro-nebula-pink/20 border border-astro-nebula-pink/30' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                        {index + 1}
                      </div>
                      <span>{friend.name}</span>
                    </div>
                    <span className="text-astro-star-gold">{friend.xp} XP</span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link to="/leaderboard">
                  <Button variant="outline" className="w-full">Ver Ranking Completo</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-2xl font-bold mb-6">Seus Assuntos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockSubjects.map((subject) => (
            <SubjectCard 
              key={subject.id}
              id={subject.id}
              title={subject.title}
              description={subject.description}
              completed={subject.completed}
              total={subject.total}
              icon={subject.icon}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
