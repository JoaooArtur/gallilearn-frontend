
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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
import { Loader2 } from 'lucide-react';
import { subjectsService, StudentLesson, Subject } from '@/services/subjects.service';
import { toast } from 'sonner';

const SubjectPage = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  
  // Fetch subject details
  const { 
    data: subject,
    isLoading: subjectLoading,
    error: subjectError
  } = useQuery({
    queryKey: ['subject', subjectId],
    queryFn: () => subjectId ? subjectsService.getSubjectById(subjectId) : Promise.reject('No subject ID provided'),
    enabled: !!subjectId
  });
  
  // Fetch student lessons for the subject
  const {
    data: studentLessons,
    isLoading: lessonsLoading,
    error: lessonsError
  } = useQuery({
    queryKey: ['studentLessons', subjectId],
    queryFn: () => subjectId ? subjectsService.getStudentLessonsBySubjectId(subjectId) : Promise.reject('No subject ID provided'),
    enabled: !!subjectId
  });
  
  // Handle loading and error states
  if (subjectLoading || lessonsLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-astro-nebula-pink" />
        <p className="mt-4">Carregando informações...</p>
      </div>
    );
  }
  
  if (subjectError || lessonsError) {
    toast.error('Erro ao carregar dados do assunto ou lições');
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl mb-4">Erro ao carregar dados</h1>
        <p className="text-muted-foreground mb-6">
          {subjectError instanceof Error ? subjectError.message : 'Erro desconhecido'}
          {lessonsError instanceof Error ? lessonsError.message : ''}
        </p>
        <Link to="/dashboard">
          <Button>Voltar para Dashboard</Button>
        </Link>
      </div>
    );
  }
  
  if (!subject || !studentLessons) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl mb-4">Assunto não encontrado</h1>
        <Link to="/dashboard">
          <Button>Voltar para Dashboard</Button>
        </Link>
      </div>
    );
  }
  
  // Process lessons data for UI display
  const processedLessons = studentLessons.map((studentLesson, index) => {
    const isFinished = studentLesson.status.name === 'Finished';
    return {
      id: studentLesson.subject.id,
      subjectId: studentLesson.subject.subjectId,
      title: studentLesson.subject.title,
      content: studentLesson.subject.content,
      questions: 5, // Fixed to 5 questions as requested
      completed: isFinished,
      locked: !isFinished && index > 0 // Lock lessons after the first one if not completed
    };
  });
  
  // Calculate progress
  const completedLessons = processedLessons.filter(lesson => lesson.completed).length;
  const totalLessons = processedLessons.length;
  
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
              {/* Placeholder icon */}
              🌌
            </div>
            <div>
              <h1 className="text-3xl font-bold">{subject.name}</h1>
              <p className="text-muted-foreground">{subject.description}</p>
            </div>
          </div>
          
          <Card className="mb-8">
            <CardContent className="p-4">
              <ProgressBar 
                value={completedLessons} 
                max={totalLessons} 
                label={`Progresso em ${subject.name}`} 
              />
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-2xl font-bold mb-6">Lições</h2>
        
        {processedLessons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedLessons.map((lesson, index) => (
              <LessonCard 
                key={lesson.id}
                id={lesson.id}
                subjectId={lesson.subjectId}
                title={lesson.title}
                content={lesson.content}
                questions={lesson.questions}
                completed={lesson.completed}
                locked={lesson.locked}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Nenhuma lição encontrada para este assunto.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SubjectPage;
