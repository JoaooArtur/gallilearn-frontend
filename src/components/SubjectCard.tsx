
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProgressBar from './ProgressBar';
import { Link } from 'react-router-dom';

interface SubjectCardProps {
  id: string;
  title: string;
  description: string;
  completed: number;
  total: number;
  icon: string;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ 
  id, 
  title, 
  description, 
  completed, 
  total,
  icon
}) => {
  return (
    <Card className="overflow-hidden group hover:border-astro-nebula-pink/50 transition-all duration-300">
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-astro-nebula-pink/20 to-astro-planet-teal/20 rounded-full blur-xl group-hover:from-astro-nebula-pink/30 group-hover:to-astro-planet-teal/30 transition-all duration-300" />
      
      <CardHeader className="relative">
        <div className="flex items-start justify-between mb-2">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-astro-deep-blue border border-astro-nebula-pink/50">
            <span className="text-xl">{ icon }</span>
          </div>
          <span className="text-xs px-2 py-1 bg-muted rounded-full">
            {completed}/{total} lições
          </span>
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <ProgressBar value={completed} max={total} />
      </CardContent>
      
      <CardFooter>
        <Link to={`/subject/${id}`} className="w-full">
          <Button variant="outline" className="w-full group-hover:border-astro-nebula-pink/50 group-hover:text-astro-nebula-pink transition-all">
            {completed === 0 ? "Começar" : completed === total ? "Revisar" : "Continuar"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SubjectCard;
