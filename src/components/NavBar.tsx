
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import Logo from './Logo';

const NavBar = () => {
  return (
    <header className="w-full p-4 border-b border-border/40 backdrop-blur-sm bg-background/30 fixed top-0 z-10">
      <div className="container flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center">
          <Logo />
        </Link>
        
        <div className="flex items-center gap-4">
          <Link to="/subjects">
            <Button variant="ghost">Lições</Button>
          </Link>
          <Link to="/leaderboard">
            <Button variant="ghost">Ranking</Button>
          </Link>
          <Link to="/friends">
            <Button variant="ghost">Amigos</Button>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" alt="Avatar" />
                  <AvatarFallback className="bg-astro-cosmic-purple text-primary-foreground">AU</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/profile">Meu Perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">Configurações</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/">Sair</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
