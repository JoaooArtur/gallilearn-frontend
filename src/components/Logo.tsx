
import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 bg-astro-nebula-pink rounded-full opacity-70 animate-pulse-star"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-astro-star-gold rounded-full animate-pulse-star"></div>
        </div>
      </div>
      <span className="text-2xl font-bold bg-gradient-to-r from-astro-star-gold via-astro-nebula-pink to-astro-planet-teal bg-clip-text text-transparent">
        AstroQuest
      </span>
    </div>
  );
};

export default Logo;
