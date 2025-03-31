
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import StarField from '@/components/StarField';
import SubjectCard from '@/components/SubjectCard';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { subjectsService, PaginatedResponse, Subject } from '@/services/subjects.service';
import { toast } from 'sonner';

const SubjectsPage = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['subjects', page, limit],
    queryFn: () => subjectsService.getSubjects(page, limit),
    retry: 1,
    onError: (error) => {
      toast.error('Failed to load subjects', {
        description: error instanceof Error ? error.message : 'Please try again later'
      });
    }
  });

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    if (data && !data.page.hasNext && newPage > data.page.number) return;
    setPage(newPage);
  };

  // Mock icons for subjects - in a real application, these would come from the API
  const getIconForSubject = (index: number) => {
    const icons = ['🌌', '🪐', '✨', '🔭', '⚡', '🌍'];
    return icons[index % icons.length];
  };

  // Convert API subjects to the format expected by SubjectCard
  const mapSubjectToCardProps = (subject: Subject, index: number) => ({
    id: subject.id,
    title: subject.name,
    description: subject.description,
    completed: 0, // This would come from user progress data in a real app
    total: 5,     // This would be the total lessons in a real app
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
          
          <h1 className="text-3xl font-bold text-center mb-2">Explore o Cosmos</h1>
          <p className="text-center text-muted-foreground mb-8">
            Descubra todos os assuntos disponíveis para seu aprendizado em astrofísica
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
        ) : isError ? (
          <div className="text-center p-12">
            <p className="text-destructive mb-4">Não foi possível carregar os assuntos.</p>
            <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
          </div>
        ) : data && data.items.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.items.map((subject, index) => (
                <SubjectCard 
                  key={subject.id}
                  {...mapSubjectToCardProps(subject, index)}
                />
              ))}
            </div>
            
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(page - 1)}
                    className={!data.page.hasPrevious ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink isActive>{data.page.number}</PaginationLink>
                </PaginationItem>
                {data.page.hasNext && (
                  <PaginationItem>
                    <PaginationLink onClick={() => handlePageChange(page + 1)} className="cursor-pointer">
                      {data.page.number + 1}
                    </PaginationLink>
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(page + 1)}
                    className={!data.page.hasNext ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        ) : (
          <div className="text-center p-12">
            <p className="text-muted-foreground mb-4">Nenhum assunto encontrado.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SubjectsPage;
