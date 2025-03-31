
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import StarField from '@/components/StarField';
import LessonCard from '@/components/LessonCard';
import ProgressBar from '@/components/ProgressBar';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

// Dados de exemplo para a página de assunto
const mockSubjects = {
  '1': {
    id: '1',
    title: 'Introdução à Astrofísica',
    description: 'Conceitos fundamentais para entender o universo e seus fenômenos.',
    lessons: [
      {
        id: '101',
        title: 'O que é Astrofísica?',
        questions: 5,
        completed: true,
        locked: false
      },
      {
        id: '102',
        title: 'Conceitos Básicos de Astronomia',
        questions: 7,
        completed: true,
        locked: false
      },
      {
        id: '103',
        title: 'Leis Fundamentais da Física',
        questions: 8,
        completed: false,
        locked: false
      },
      {
        id: '104',
        title: 'Escalas do Universo',
        questions: 6,
        completed: false,
        locked: true
      },
      {
        id: '105',
        title: 'História da Astronomia',
        questions: 10,
        completed: false,
        locked: true
      }
    ],
    completed: 2,
    total: 5,
    icon: '🌌'
  },
  '2': {
    id: '2',
    title: 'Sistema Solar',
    description: 'Explore os planetas, luas e outros objetos do nosso sistema solar.',
    lessons: [
      {
        id: '201',
        title: 'O Sol: Nossa Estrela',
        questions: 6,
        completed: false,
        locked: false
      },
      {
        id: '202',
        title: 'Planetas Rochosos',
        questions: 8,
        completed: false,
        locked: true
      },
      {
        id: '203',
        title: 'Planetas Gasosos',
        questions: 7,
        completed: false,
        locked: true
      },
      {
        id: '204',
        title: 'Asteroides e Cometas',
        questions: 5,
        completed: false,
        locked: true
      }
    ],
    completed: 0,
    total: 4,
    icon: '🪐'
  },
  '3': {
    id: '3',
    title: 'Estrelas e Galáxias',
    description: 'Como as estrelas nascem, vivem e morrem, e a formação de galáxias.',
    lessons: [
      {
        id: '301',
        title: 'Ciclo de Vida das Estrelas',
        questions: 9,
        completed: false,
        locked: false
      },
      {
        id: '302',
        title: 'Classificação Estelar',
        questions: 7,
        completed: false,
        locked: true
      },
      {
        id: '303',
        title: 'Galáxias e sua Estrutura',
        questions: 8,
        completed: false,
        locked: true
      },
      {
        id: '304',
        title: 'A Via Láctea',
        questions: 6,
        completed: false,
        locked: true
      },
      {
        id: '305',
        title: 'Supernovas e Buracos Negros',
        questions: 10,
        completed: false,
        locked: true
      },
      {
        id: '306',
        title: 'Expansão do Universo',
        questions: 8,
        completed: false,
        locked: true
      }
    ],
    completed: 0,
    total: 6,
    icon: '✨'
  }
};

const SubjectPage = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  
  // Em uma aplicação real, buscaríamos os dados do servidor
  const subject = mockSubjects[subjectId as keyof typeof mockSubjects];
  
  if (!subject) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl mb-4">Assunto não encontrado</h1>
        <Link to="/dashboard">
          <Button>Voltar para Dashboard</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pb-16">
      <StarField />
      <NavBar />
      
      <main className="container pt-24">
        <div className="mb-8">
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block">
            ← Voltar para Dashboard
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-astro-deep-blue border border-astro-nebula-pink/50 text-2xl">
              {subject.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{subject.title}</h1>
              <p className="text-muted-foreground">{subject.description}</p>
            </div>
          </div>
          
          <Card className="mb-8">
            <CardContent className="p-4">
              <ProgressBar 
                value={subject.completed} 
                max={subject.total} 
                label={`Progresso em ${subject.title}`} 
              />
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-2xl font-bold mb-6">Lições</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subject.lessons.map((lesson) => (
            <LessonCard 
              key={lesson.id}
              id={lesson.id}
              subjectId={subject.id}
              title={lesson.title}
              questions={lesson.questions}
              completed={lesson.completed}
              locked={lesson.locked}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default SubjectPage;
