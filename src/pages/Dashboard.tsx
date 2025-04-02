import React from 'react';
import { useQuery } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import StarField from '@/components/StarField';
import DashboardCard from '@/components/DashboardCard';
import { Link } from 'react-router-dom';
import { subjectsService } from '@/services/subjects.service';
import { userService } from '@/services/user.service';
import { toast } from 'sonner';

const Dashboard = () => {
  const { data: subjects, isLoading: subjectsLoading, isError: subjectsError } = useQuery({
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

  const { data: profile, isLoading: profileLoading, isError: profileError } = useQuery({
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

  const getIconForSubject = (index: number) => {
    const icons = ['🌌', '🪐', '✨', '🔭', '⚡', '🌍'];
    return icons[index % icons.length];
  };

  const mapSubjectToCardProps = (subject: any, index: number) => ({
    id: subject.id,
    title: subject.name,
    description: subject.description,
    completed: subject.completedLessonsCount || 0,
    total: subject.lessonsCount || 0,
    icon: getIconForSubject(index)
  });

  return (
    <div className="min-h-screen pb-16">
      <StarField />
      <NavBar />

      <main className="container pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Painel de Controle</h1>
          <p className="text-center text-muted-foreground mb-8">
            Acompanhe seu progresso e explore novos desafios no universo da astrofísica
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjectsLoading ? (
            <div className="col-span-full text-center">Carregando assuntos...</div>
          ) : subjectsError ? (
            <div className="col-span-full text-center text-red-500">Erro ao carregar assuntos.</div>
          ) : subjects && subjects.length > 0 ? (
            subjects.map((subject, index) => (
              <DashboardCard
                key={subject.id}
                {...mapSubjectToCardProps(subject, index)}
              />
            ))
          ) : (
            <div className="col-span-full text-center">Nenhum assunto encontrado.</div>
          )}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Próximo Nível</h2>
          {profileLoading ? (
            <div>Carregando perfil...</div>
          ) : profileError ? (
            <div className="text-red-500">Erro ao carregar perfil.</div>
          ) : profile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p>
                  Olá, {profile.name}! Você está no nível {profile.level} e precisa de mais {profile.nextLevelXPNeeded} XP para o próximo nível.
                </p>
              </div>
              <div>
                <Link to="/profile" className="text-blue-500 hover:underline">
                  Ver Perfil
                </Link>
              </div>
            </div>
          ) : (
            <div>Perfil não encontrado.</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
