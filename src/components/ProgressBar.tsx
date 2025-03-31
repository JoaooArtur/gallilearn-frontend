
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, label }) => {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);
  
  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between text-sm">
          <span>{label}</span>
          <span>{value}/{max}</span>
        </div>
      )}
      <div className="relative">
        <Progress value={percentage} className="h-3" />
        <div 
          className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-astro-nebula-pink/20 to-astro-planet-teal/20 opacity-50" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
