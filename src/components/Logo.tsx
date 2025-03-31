
import React from 'react';
import { Rocket } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-10 h-10 flex items-center justify-center">
        <div className="absolute inset-0 bg-astro-nebula-pink rounded-full opacity-70 animate-pulse-star"></div>
        <Rocket className="w-6 h-6 text-astro-star-gold z-10" />
      </div>
      <span className="text-2xl font-bold bg-gradient-to-r from-astro-star-gold via-astro-nebula-pink to-astro-planet-teal bg-clip-text text-transparent">
        AstroQuest
      </span>
    </div>
  );
};

export default Logo;
