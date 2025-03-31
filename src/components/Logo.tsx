
import React from 'react';
import { Rocket } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <Rocket className="w-8 h-8 text-astro-nebula-pink" />
      <span className="text-2xl font-bold bg-gradient-to-r from-astro-nebula-pink via-astro-planet-teal to-astro-cosmic-purple bg-clip-text text-transparent">
        Gallilearn
      </span>
    </div>
  );
};

export default Logo;
