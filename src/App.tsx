
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import SubjectPage from "./pages/SubjectPage";
import LessonPage from "./pages/LessonPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import FriendsPage from "./pages/FriendsPage";
import ProfilePage from "./pages/ProfilePage";
import SubjectsPage from "./pages/SubjectsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/subject/:subjectId" element={<SubjectPage />} />
          <Route path="/subject/:subjectId/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
