
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
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Loader2 } from 'lucide-react';
import { subjectsService, Subject, Lesson, PaginatedResponse } from '@/services/subjects.service';
import { toast } from 'sonner';

const SubjectPage = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [page, setPage] = useState(1);
  const limit = 10;
  
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
  
  // Fetch lessons for the subject
  const {
    data: lessonsData,
    isLoading: lessonsLoading,
    error: lessonsError
  } = useQuery({
    queryKey: ['lessons', subjectId, page, limit],
    queryFn: () => subjectId ? subjectsService.getLessonsBySubjectId(subjectId, page, limit) : Promise.reject('No subject ID provided'),
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
  
  if (!subject || !lessonsData) {
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
  const lessons = lessonsData.items.map((lesson, index) => ({
    ...lesson,
    questions: 5, // Placeholder for now - would come from API in real implementation
    completed: index === 0, // Just for demonstration
    locked: index > 1 // Lock lessons after the second one for demonstration
  }));
  
  // Calculate progress
  const completedLessons = lessons.filter(lesson => lesson.completed).length;
  const totalLessons = lessons.length;
  
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
        
        {lessons.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson) => (
                <LessonCard 
                  key={lesson.id}
                  id={lesson.id}
                  subjectId={lesson.subjectId}
                  title={lesson.title}
                  questions={lesson.questions || 0}
                  completed={lesson.completed || false}
                  locked={lesson.locked || false}
                />
              ))}
            </div>
            
            {/* Pagination */}
            {(lessonsData.page.hasNext || lessonsData.page.hasPrevious) && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      className={!lessonsData.page.hasPrevious ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  <PaginationItem>
                    <PaginationLink isActive>{lessonsData.page.number}</PaginationLink>
                  </PaginationItem>
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setPage(p => lessonsData.page.hasNext ? p + 1 : p)}
                      className={!lessonsData.page.hasNext ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
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
