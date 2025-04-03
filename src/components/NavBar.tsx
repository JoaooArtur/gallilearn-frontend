
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { userService } from '@/services/user.service';
import Logo from './Logo';
import { useAuth } from '@/context/AuthContext';

const NavBar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  // Get student profile data
  const { data: studentProfile } = useQuery({
    queryKey: ['studentProfile'],
    queryFn: () => userService.getCurrentStudent()
  });

  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return 'AU';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
                  <AvatarFallback className="bg-astro-cosmic-purple text-primary-foreground">
                    {studentProfile ? getInitials(studentProfile.name) : 'AU'}
                  </AvatarFallback>
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
              <DropdownMenuItem onClick={handleLogout}>
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
