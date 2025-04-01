
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface LessonCardProps {
  id: string;
  subjectId: string;
  title: string;
  content?: string;
  questions: number;
  completed: boolean;
  locked: boolean;
}

const LessonCard: React.FC<LessonCardProps> = ({ 
  id, 
  subjectId, 
  title,
  content,
  questions, 
  completed, 
  locked 
}) => {
  const [isContentOpen, setIsContentOpen] = useState(false);

  return (
    <>
      <Card className={`flex flex-col h-full transition-all duration-300 ${locked ? 'opacity-70 bg-muted/50' : completed ? 'border-astro-planet-teal/50' : 'hover:border-astro-nebula-pink/50'}`}>
        <CardContent className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            locked 
              ? 'bg-muted border-muted-foreground/30 border' 
              : completed 
                ? 'bg-astro-planet-teal/20 border-astro-planet-teal border' 
                : 'bg-astro-nebula-pink/20 border-astro-nebula-pink/50 border animate-pulse-star'
          }`}>
            {completed ? (
              <span className="text-2xl">✓</span>
            ) : locked ? (
              <span className="text-2xl">🔒</span>
            ) : (
              <span className="text-2xl">🚀</span>
            )}
          </div>
          
          <h3 className="font-medium mb-2">{title}</h3>
          
          <Badge variant="outline" className={`mb-2 ${completed ? 'bg-green-100 text-green-800 border-green-300' : ''}`}>
            {completed ? "Concluída" : `${questions} ${questions === 1 ? 'pergunta' : 'perguntas'}`}
          </Badge>

          {content && (
            <Button 
              variant="outline" 
              size="sm"
              className="mt-2"
              onClick={() => setIsContentOpen(true)}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Ler Conteúdo
            </Button>
          )}
        </CardContent>
        
        <CardFooter className="pt-0">
          {locked ? (
            <Button variant="outline" className="w-full" disabled>Bloqueado</Button>
          ) : (
            <Link to={`/subject/${subjectId}/lesson/${id}`} className="w-full">
              <Button 
                variant={completed ? "outline" : "default"} 
                className={`w-full ${completed ? 'border-astro-planet-teal text-astro-planet-teal hover:bg-astro-planet-teal/10' : ''}`}
              >
                {completed ? "Revisar" : "Iniciar"}
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>

      {content && (
        <Dialog open={isContentOpen} onOpenChange={setIsContentOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>
                Conteúdo da lição
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 whitespace-pre-line">
              {content}
            </div>
            <DialogFooter>
              <Button onClick={() => setIsContentOpen(false)}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default LessonCard;
