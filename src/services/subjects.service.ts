
import { apiService } from './api.service';

// Subject interface
export interface Subject {
  id: string;
  title: string;
  description: string;
  completed: number;
  total: number;
  icon: string;
}

// Lesson interface
export interface Lesson {
  id: string;
  subjectId: string;
  title: string;
  questions: number;
  completed: boolean;
  locked: boolean;
}

// Question interface
export interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
}

/**
 * Service for subject-related API calls
 */
export const subjectsService = {
  /**
   * Get all subjects
   */
  async getAllSubjects(): Promise<Subject[]> {
    const response = await apiService.get<Subject[]>('/subjects');
    
    if (response.error) {
      console.error('Failed to fetch subjects:', response.error);
      throw new Error(response.error);
    }
    
    return response.data || [];
  },
  
  /**
   * Get subject by ID
   */
  async getSubjectById(subjectId: string): Promise<Subject> {
    const response = await apiService.get<Subject>(`/subjects/${subjectId}`);
    
    if (response.error) {
      console.error(`Failed to fetch subject ${subjectId}:`, response.error);
      throw new Error(response.error);
    }
    
    return response.data as Subject;
  },
  
  /**
   * Get lessons for a subject
   */
  async getLessonsBySubjectId(subjectId: string): Promise<Lesson[]> {
    const response = await apiService.get<Lesson[]>(`/subjects/${subjectId}/lessons`);
    
    if (response.error) {
      console.error(`Failed to fetch lessons for subject ${subjectId}:`, response.error);
      throw new Error(response.error);
    }
    
    return response.data || [];
  },
  
  /**
   * Get questions for a lesson
   */
  async getQuestionsByLessonId(lessonId: string): Promise<Question[]> {
    const response = await apiService.get<Question[]>(`/lessons/${lessonId}/questions`);
    
    if (response.error) {
      console.error(`Failed to fetch questions for lesson ${lessonId}:`, response.error);
      throw new Error(response.error);
    }
    
    return response.data || [];
  },
  
  /**
   * Submit lesson results
   */
  async submitLessonResults(lessonId: string, results: { correctAnswers: number, totalQuestions: number }): Promise<void> {
    const response = await apiService.post<typeof results, void>(`/lessons/${lessonId}/results`, results);
    
    if (response.error) {
      console.error(`Failed to submit results for lesson ${lessonId}:`, response.error);
      throw new Error(response.error);
    }
  }
};
