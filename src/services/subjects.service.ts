
import { apiService } from './api.service';
import { useAuth } from '@/contexts/AuthContext';

// Tipos
interface Subject {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  lessonsCount: number;
  completedLessonsCount: number;
  progress: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  duration: number;
  order: number;
  completed: boolean;
  imageUrl: string;
  quizzes: Quiz[];
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

interface Question {
  id: string;
  text: string;
  options: Option[];
  correctOptionId: string;
}

interface Option {
  id: string;
  text: string;
}

interface AnswerSubmission {
  questionId: string;
  selectedOptionId: string;
}

// Serviço de subjects
export const subjectsService = {
  /**
   * Obter todos os subjects disponíveis para o estudante
   */
  async getSubjects() {
    const { user } = useAuth();
    const studentId = user?.sub || '';
    return apiService.get<Subject[]>(`/students/${studentId}/subjects`);
  },

  /**
   * Obter um subject específico pelo ID
   * @param subjectId ID do subject
   */
  async getSubject(subjectId: string) {
    const { user } = useAuth();
    const studentId = user?.sub || '';
    return apiService.get<Subject>(`/students/${studentId}/subjects/${subjectId}`);
  },

  /**
   * Obter todas as lições de um subject
   * @param subjectId ID do subject
   */
  async getLessons(subjectId: string) {
    const { user } = useAuth();
    const studentId = user?.sub || '';
    return apiService.get<Lesson[]>(`/students/${studentId}/subjects/${subjectId}/lessons`);
  },

  /**
   * Obter uma lição específica pelo ID
   * @param subjectId ID do subject
   * @param lessonId ID da lição
   */
  async getLesson(subjectId: string, lessonId: string) {
    const { user } = useAuth();
    const studentId = user?.sub || '';
    return apiService.get<Lesson>(`/students/${studentId}/subjects/${subjectId}/lessons/${lessonId}`);
  },

  /**
   * Marcar uma lição como concluída
   * @param subjectId ID do subject
   * @param lessonId ID da lição
   */
  async completeLesson(subjectId: string, lessonId: string) {
    const { user } = useAuth();
    const studentId = user?.sub || '';
    return apiService.post(`/students/${studentId}/subjects/${subjectId}/lessons/${lessonId}/complete`, {});
  },

  /**
   * Enviar respostas de um quiz
   * @param subjectId ID do subject
   * @param lessonId ID da lição
   * @param quizId ID do quiz
   * @param answers Respostas do quiz
   */
  async submitQuizAnswers(
    subjectId: string,
    lessonId: string,
    quizId: string,
    answers: AnswerSubmission[]
  ) {
    const { user } = useAuth();
    const studentId = user?.sub || '';
    return apiService.post(`/students/${studentId}/subjects/${subjectId}/lessons/${lessonId}/quizzes/${quizId}/submit`, { answers });
  },
};
