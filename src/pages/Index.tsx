
import React from 'react';
import AuthForm from "@/components/AuthForm";
import StarField from '@/components/StarField';
import Logo from '@/components/Logo';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      <StarField />
      <div className="w-full max-w-4xl mx-auto text-center z-10 mb-8">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-astro-star-gold via-white to-astro-nebula-pink bg-clip-text text-transparent">
          Embarque em Uma Jornada Pelo Cosmos
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Aprenda astrofísica de forma divertida e interativa. Explore o universo, desafie seus amigos e conquiste as estrelas!
        </p>
        
        <div className="w-full max-w-md mx-auto">
          <AuthForm />
        </div>
        
        <div className="mt-12 text-muted-foreground text-sm">
          <p>Uma plataforma educativa onde você pode aprender sobre o cosmos enquanto compete com amigos.</p>
          <p>Desvende os mistérios do universo um quiz por vez.</p>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-astro-cosmic-purple/30 to-transparent"></div>
    </div>
  );
};

export default Index;
