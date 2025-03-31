
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';

interface Option {
  id: string;
  text: string;
}

interface QuizQuestionProps {
  question: string;
  options: Option[];
  correctOptionId: string;
  selectedOptionId?: string;
  hasSubmitted: boolean;
  isCorrect: boolean;
  isPending: boolean;
  onAnswer: (answerId: string) => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ 
  question, 
  options, 
  correctOptionId,
  selectedOptionId,
  hasSubmitted,
  isCorrect,
  isPending,
  onAnswer
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const handleSubmit = () => {
    if (!selectedOption) return;
    onAnswer(selectedOption);
  };
  
  const getOptionStyles = (optionId: string) => {
    if (!hasSubmitted) return "";
    
    if (optionId === correctOptionId) {
      return "border-green-500 bg-green-500/10 text-green-500";
    }
    
    if (optionId === selectedOptionId && optionId !== correctOptionId) {
      return "border-red-500 bg-red-500/10 text-red-500";
    }
    
    return "opacity-50";
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-xl text-center">{question}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <RadioGroup 
          value={hasSubmitted ? (selectedOptionId || "") : (selectedOption || "")} 
          onValueChange={!hasSubmitted ? setSelectedOption : undefined} 
          disabled={hasSubmitted || isPending}
        >
          <div className="space-y-3">
            {options.map((option) => (
              <label
                key={option.id}
                className={`flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all 
                  ${!hasSubmitted && !isPending && 'hover:border-astro-nebula-pink/70'} 
                  ${isPending && 'opacity-70'}
                  ${getOptionStyles(option.id)}`}
              >
                <RadioGroupItem value={option.id} id={option.id} disabled={hasSubmitted || isPending} />
                <Label htmlFor={option.id} className="flex-grow cursor-pointer">{option.text}</Label>
              </label>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-4">
        {hasSubmitted ? (
          <div className={`w-full p-4 rounded-lg text-center ${isCorrect ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
            {isCorrect 
              ? '✓ Correto! Excelente trabalho!' 
              : '✗ Incorreto. A resposta correta está destacada.'}
          </div>
        ) : (
          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={!selectedOption || isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              'Verificar Resposta'
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default QuizQuestion;
