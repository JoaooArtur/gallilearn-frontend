
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import StarField from '@/components/StarField';
import QuizQuestion from '@/components/QuizQuestion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

// Dados de exemplo para a página de lição
const mockLessons = {
  '101': {
    id: '101',
    title: 'O que é Astrofísica?',
    subjectId: '1',
    questions: [
      {
        id: '1001',
        text: 'O que estuda a Astrofísica?',
        options: [
          { id: 'a', text: 'Apenas a composição química dos planetas' },
          { id: 'b', text: 'A aplicação das leis da física para compreender objetos e fenômenos astronômicos' },
          { id: 'c', text: 'Somente o movimento dos planetas ao redor do Sol' },
          { id: 'd', text: 'Apenas a origem do universo' }
        ],
        correctOptionId: 'b'
      },
      {
        id: '1002',
        text: 'Qual destes NÃO é um campo de estudo da Astrofísica?',
        options: [
          { id: 'a', text: 'Cosmologia' },
          { id: 'b', text: 'Evolução estelar' },
          { id: 'c', text: 'Astrologia' },
          { id: 'd', text: 'Formação planetária' }
        ],
        correctOptionId: 'c'
      },
      {
        id: '1003',
        text: 'Qual é uma das principais ferramentas de observação usadas na Astrofísica moderna?',
        options: [
          { id: 'a', text: 'Microscópios eletrônicos' },
          { id: 'b', text: 'Telescópios espaciais' },
          { id: 'c', text: 'Sismógrafos' },
          { id: 'd', text: 'Pêndulos' }
        ],
        correctOptionId: 'b'
      },
      {
        id: '1004',
        text: 'Qual destas é uma forma de energia estudada em Astrofísica?',
        options: [
          { id: 'a', text: 'Energia mística' },
          { id: 'b', text: 'Energia escura' },
          { id: 'c', text: 'Energia vital' },
          { id: 'd', text: 'Energia espiritualizada' }
        ],
        correctOptionId: 'b'
      },
      {
        id: '1005',
        text: 'Quem é considerado o pai da Astrofísica moderna?',
        options: [
          { id: 'a', text: 'Albert Einstein' },
          { id: 'b', text: 'Stephen Hawking' },
          { id: 'c', text: 'Isaac Newton' },
          { id: 'd', text: 'Carl Sagan' }
        ],
        correctOptionId: 'a'
      }
    ]
  },
  '102': {
    id: '102',
    title: 'Conceitos Básicos de Astronomia',
    subjectId: '1',
    questions: [
      {
        id: '1006',
        text: 'Qual é a unidade utilizada para medir distâncias astronômicas dentro do Sistema Solar?',
        options: [
          { id: 'a', text: 'Ano-luz' },
          { id: 'b', text: 'Quilômetro' },
          { id: 'c', text: 'Unidade Astronômica (UA)' },
          { id: 'd', text: 'Parsec' }
        ],
        correctOptionId: 'c'
      },
      {
        id: '1007',
        text: 'O que é uma constelação?',
        options: [
          { id: 'a', text: 'Um grupo de estrelas fisicamente conectadas entre si' },
          { id: 'b', text: 'Um padrão aparente de estrelas no céu noturno' },
          { id: 'c', text: 'Um tipo específico de galáxia' },
          { id: 'd', text: 'Uma nebulosa luminosa' }
        ],
        correctOptionId: 'b'
      }
    ]
  }
};

const LessonPage = () => {
  const { subjectId, lessonId } = useParams<{ subjectId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Em uma aplicação real, buscaríamos os dados do servidor
  const lesson = mockLessons[lessonId as keyof typeof mockLessons];
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [completed, setCompleted] = useState(false);
  
  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl mb-4">Lição não encontrada</h1>
        <Link to={`/subject/${subjectId}`}>
          <Button>Voltar para o Assunto</Button>
        </Link>
      </div>
    );
  }
  
  const currentQuestion = lesson.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / lesson.questions.length) * 100;
  
  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    
    // Aguarda um pouco para mostrar a próxima pergunta
    setTimeout(() => {
      if (currentQuestionIndex < lesson.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setCompleted(true);
      }
    }, 1500);
  };
  
  const handleFinish = () => {
    const accuracy = (correctAnswers / lesson.questions.length) * 100;
    
    // Em uma aplicação real, enviaríamos esta pontuação para o servidor
    toast({
      title: "Lição Concluída!",
      description: `Você acertou ${correctAnswers} de ${lesson.questions.length} questões (${accuracy.toFixed(0)}%).`,
    });
    
    navigate(`/subject/${subjectId}`);
  };
  
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
              Questão {currentQuestionIndex + 1} de {lesson.questions.length}
            </span>
          </div>
          
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-center">{lesson.title}</h1>
          </div>
          
          <div className="w-full mb-8">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
        
        {!completed ? (
          <QuizQuestion 
            question={currentQuestion.text}
            options={currentQuestion.options}
            correctOptionId={currentQuestion.correctOptionId}
            onAnswer={handleAnswer}
          />
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 rounded-full bg-astro-planet-teal/20 border-2 border-astro-planet-teal flex items-center justify-center mb-6">
              <span className="text-4xl">✓</span>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Lição Completa!</h2>
            <p className="text-lg mb-2">
              Você acertou {correctAnswers} de {lesson.questions.length} questões
            </p>
            <p className="text-muted-foreground mb-8">
              {correctAnswers === lesson.questions.length 
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
