
import React from 'react';

const StarField = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
      <div className="stars-container opacity-80"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-cosmic-glow"></div>
    </div>
  );
};

export default StarField;
