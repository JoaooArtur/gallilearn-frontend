
import React from 'react';
import NavBar from '@/components/NavBar';
import StarField from '@/components/StarField';
import SubjectCard from '@/components/SubjectCard';
import { Link } from 'react-router-dom';

// Dados de exemplo para a página de todos os assuntos
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
  },
  {
    id: '4',
    title: 'Cosmologia',
    description: 'A origem, evolução e o destino final do Universo.',
    completed: 0,
    total: 7,
    icon: '🔭'
  },
  {
    id: '5',
    title: 'Astrofísica de Altas Energias',
    description: 'Fenômenos energéticos como buracos negros e supernovas.',
    completed: 0,
    total: 5,
    icon: '⚡'
  },
  {
    id: '6',
    title: 'Exoplanetas',
    description: 'Descoberta e caracterização de planetas fora do Sistema Solar.',
    completed: 0,
    total: 4,
    icon: '🌍'
  }
];

const SubjectsPage = () => {
  return (
    <div className="min-h-screen pb-16">
      <StarField />
      <NavBar />
      
      <main className="container pt-24">
        <div className="mb-8">
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block">
            ← Voltar para Dashboard
          </Link>
          
          <h1 className="text-3xl font-bold text-center mb-2">Explore o Cosmos</h1>
          <p className="text-center text-muted-foreground mb-8">
            Descubra todos os assuntos disponíveis para seu aprendizado em astrofísica
          </p>
        </div>
        
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

export default SubjectsPage;
