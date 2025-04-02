
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from 'react-router-dom';

interface DashboardCardProps {
  id: string;
  title: string;
  description: string;
  completed: number;
  total: number;
  icon: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  id,
  title,
  description,
  completed,
  total,
  icon
}) => {
  const progress = total > 0 ? (completed / total) * 100 : 0;
  
  return (
    <Link to={`/subject/${id}`}>
      <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{icon}</span>
            <h3 className="font-bold">{title}</h3>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {description}
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso</span>
              <span>{completed}/{total} lições</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default DashboardCard;
