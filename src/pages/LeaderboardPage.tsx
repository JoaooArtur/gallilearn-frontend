
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import StarField from '@/components/StarField';
import LeaderboardCard from '@/components/LeaderboardCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';

// Dados de exemplo para o leaderboard
const mockLeaderboardData = {
  'day': [
    { id: '101', name: 'Lucas', avatar: '', xp: 120, level: 6, position: 1 },
    { id: '102', name: 'Marina', avatar: '', xp: 90, level: 5, position: 2 },
    { id: '103', name: 'Você', avatar: '', xp: 75, level: 5, position: 3, isCurrentUser: true },
    { id: '104', name: 'João', avatar: '', xp: 60, level: 4, position: 4 },
    { id: '105', name: 'Ana', avatar: '', xp: 45, level: 3, position: 5 },
  ],
  'week': [
    { id: '101', name: 'Lucas', avatar: '', xp: 520, level: 6, position: 1 },
    { id: '102', name: 'Você', avatar: '', xp: 485, level: 5, position: 2, isCurrentUser: true },
    { id: '103', name: 'Marina', avatar: '', xp: 450, level: 5, position: 3 },
    { id: '104', name: 'João', avatar: '', xp: 380, level: 4, position: 4 },
    { id: '105', name: 'Ana', avatar: '', xp: 315, level: 3, position: 5 },
  ],
  'all-time': [
    { id: '106', name: 'Gabriel', avatar: '', xp: 3500, level: 12, position: 1 },
    { id: '101', name: 'Lucas', avatar: '', xp: 3200, level: 10, position: 2 },
    { id: '103', name: 'Marina', avatar: '', xp: 2950, level: 9, position: 3 },
    { id: '102', name: 'Você', avatar: '', xp: 2400, level: 8, position: 4, isCurrentUser: true },
    { id: '104', name: 'João', avatar: '', xp: 1900, level: 7, position: 5 },
    { id: '107', name: 'Carla', avatar: '', xp: 1750, level: 6, position: 6 },
    { id: '108', name: 'Pedro', avatar: '', xp: 1620, level: 6, position: 7 },
    { id: '105', name: 'Ana', avatar: '', xp: 1450, level: 5, position: 8 },
    { id: '109', name: 'Rafael', avatar: '', xp: 1200, level: 4, position: 9 },
    { id: '110', name: 'Juliana', avatar: '', xp: 950, level: 3, position: 10 },
  ]
};

const LeaderboardPage = () => {
  const [timeFrame, setTimeFrame] = useState<'day' | 'week' | 'all-time'>('week');
  
  return (
    <div className="min-h-screen pb-16">
      <StarField />
      <NavBar />
      
      <main className="container pt-24">
        <div className="mb-8">
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block">
            ← Voltar para Dashboard
          </Link>
          
          <h1 className="text-3xl font-bold text-center mb-2">Ranking Global</h1>
          <p className="text-center text-muted-foreground mb-8">
            Compare seu progresso com outros estudantes do universo
          </p>
          
          <Tabs value={timeFrame} onValueChange={(value) => setTimeFrame(value as 'day' | 'week' | 'all-time')} className="w-full max-w-lg mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="day">Hoje</TabsTrigger>
              <TabsTrigger value="week">Semana</TabsTrigger>
              <TabsTrigger value="all-time">Geral</TabsTrigger>
            </TabsList>
            
            <TabsContent value="day">
              <LeaderboardCard users={mockLeaderboardData.day} timeFrame="day" />
            </TabsContent>
            
            <TabsContent value="week">
              <LeaderboardCard users={mockLeaderboardData.week} timeFrame="week" />
            </TabsContent>
            
            <TabsContent value="all-time">
              <LeaderboardCard users={mockLeaderboardData['all-time']} timeFrame="all-time" />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default LeaderboardPage;
