
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import StarField from '@/components/StarField';
import QuizQuestion from '@/components/QuizQuestion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { subjectsService, Question, AnswerResponse } from '@/services/subjects.service';
import { toast } from 'sonner';

const LessonPage = () => {
  const { subjectId, lessonId } = useParams<{ subjectId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [answerResults, setAnswerResults] = useState<AnswerResponse[]>([]);
  
  // Fetch questions for this lesson
  const { 
    data: questions,
    isLoading: questionsLoading,
    error: questionsError
  } = useQuery({
    queryKey: ['lessonQuestions', subjectId, lessonId],
    queryFn: () => {
      if (!subjectId || !lessonId) return Promise.reject('Missing parameters');
      return subjectsService.getRandomQuestionsByLessonId(subjectId, lessonId);
    },
    enabled: !!subjectId && !!lessonId
  });
  
  // Start lesson attempt mutation
  const startAttemptMutation = useMutation({
    mutationFn: () => {
      if (!subjectId || !lessonId) return Promise.reject('Missing parameters');
      return subjectsService.startLessonAttempt(subjectId, lessonId);
    },
    onSuccess: (data) => {
      if (data && typeof data === 'object' && 'id' in data) {
        setAttemptId(data.id as string);
      }
    },
    onError: (error) => {
      console.error('Failed to start lesson attempt:', error);
      toast({
        title: "Erro",
        description: "Não foi possível iniciar a lição. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  });
  
  // Submit answer mutation
  const submitAnswerMutation = useMutation({
    mutationFn: ({ questionId, answerId }: { questionId: string; answerId: string }) => {
      if (!attemptId) return Promise.reject('Missing attempt ID');
      return subjectsService.submitAnswer(attemptId, questionId, answerId);
    },
    onSuccess: (data) => {
      // Add questionId and answerId to the response for tracking
      const enhancedResponse = {
        ...data,
        questionId: submitAnswerMutation.variables?.questionId,
        answerId: submitAnswerMutation.variables?.answerId
      };
      
      setAnswerResults(prev => [...prev, enhancedResponse]);
      if (data.isCorrect) {
        setCorrectAnswers(prev => prev + 1);
      }
      
      // Move to next question after a delay
      setTimeout(() => {
        if (questions && currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
        } else {
          setCompleted(true);
        }
      }, 1500);
    },
    onError: (error) => {
      console.error('Failed to submit answer:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a resposta. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  });
  
  // Start attempt when component loads
  useEffect(() => {
    if (subjectId && lessonId && !attemptId && !questionsLoading && questions) {
      startAttemptMutation.mutate();
    }
  }, [subjectId, lessonId, questionsLoading, questions]);
  
  // Handle loading and error states
  if (questionsLoading || startAttemptMutation.isPending) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-astro-nebula-pink" />
        <p className="mt-4">Carregando lição...</p>
      </div>
    );
  }
  
  if (questionsError || !questions) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl mb-4">Erro ao carregar perguntas</h1>
        <p className="text-muted-foreground mb-6">
          {questionsError instanceof Error ? questionsError.message : 'Erro desconhecido'}
        </p>
        <Link to={`/subject/${subjectId}`}>
          <Button>Voltar para o Assunto</Button>
        </Link>
      </div>
    );
  }
  
  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl mb-4">Nenhuma pergunta encontrada para esta lição</h1>
        <Link to={`/subject/${subjectId}`}>
          <Button>Voltar para o Assunto</Button>
        </Link>
      </div>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  const handleAnswer = (answerId: string) => {
    submitAnswerMutation.mutate({
      questionId: currentQuestion.id,
      answerId: answerId
    });
  };
  
  const handleFinish = () => {
    const accuracy = (correctAnswers / questions.length) * 100;
    
    toast({
      title: "Lição Concluída!",
      description: `Você acertou ${correctAnswers} de ${questions.length} questões (${accuracy.toFixed(0)}%).`,
    });
    
    navigate(`/subject/${subjectId}`);
  };
  
  // Find latest answer result for the current question
  const currentQuestionResult = answerResults.find(
    result => result.questionId === currentQuestion?.id
  );
  
  return (
    <div className="min-h-screen pb-16 flex flex-col">
      <StarField />
      <NavBar />
      
      <main className="container pt-24 flex-grow flex flex-col">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <Link to={`/subject/${subjectId}`} className="text-muted-foreground hover:text-foreground transition-colors inline-block">
              ← Voltar
            </Link>
            <span className="text-muted-foreground">
              Questão {currentQuestionIndex + 1} de {questions.length}
            </span>
          </div>
          
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-center">{currentQuestion?.text || 'Carregando...'}</h1>
          </div>
          
          <div className="w-full mb-8">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
        
        {!completed ? (
          <QuizQuestion 
            question={currentQuestion.text}
            options={currentQuestion.options.map(option => ({ id: option.id, text: option.text }))}
            correctOptionId={currentQuestionResult?.correctAnswerId || ''}
            selectedOptionId={currentQuestionResult?.answerId || ''}
            hasSubmitted={!!currentQuestionResult}
            isCorrect={currentQuestionResult?.isCorrect || false}
            onAnswer={handleAnswer}
            isPending={submitAnswerMutation.isPending}
          />
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 rounded-full bg-astro-planet-teal/20 border-2 border-astro-planet-teal flex items-center justify-center mb-6">
              <span className="text-4xl">✓</span>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Lição Completa!</h2>
            <p className="text-lg mb-2">
              Você acertou {correctAnswers} de {questions.length} questões
            </p>
            <p className="text-muted-foreground mb-8">
              {correctAnswers === questions.length 
                ? "Perfeito! Você dominou este conteúdo!" 
                : "Continue estudando para melhorar seu conhecimento!"}
            </p>
            
            <Button onClick={handleFinish} size="lg">
              Continuar
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default LessonPage;
