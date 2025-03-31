
import { apiService } from './api.service';

// Subject interface updated to match API response
export interface Subject {
  id: string;
  name: string;
  description: string;
  index: number;
  createdAt: string;
}

// Paginated response interface
export interface PaginatedResponse<T> {
  items: T[];
  page: {
    hasNext: boolean;
    hasPrevious: boolean;
    number: number;
    size: number;
  };
}

// Lesson interface updated to match API response
export interface Lesson {
  id: string;
  subjectId: string;
  title: string;
  content: string;
  index: number;
  createdAt: string;
  // These fields are for UI display and will be added manually
  questions?: number;
  completed?: boolean;
  locked?: boolean;
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
   * Get subjects with pagination
   */
  async getSubjects(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Subject>> {
    const response = await apiService.get<PaginatedResponse<Subject>>(`/subjects/subject?Offset=${page}&Limit=${limit}`);
    
    if (response.error) {
      console.error('Failed to fetch subjects:', response.error);
      throw new Error(response.error);
    }
    
    return response.data as PaginatedResponse<Subject>;
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
   * Get lessons for a subject with pagination
   */
  async getLessonsBySubjectId(subjectId: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Lesson>> {
    const response = await apiService.get<PaginatedResponse<Lesson>>(`/subjects/${subjectId}/lesson?Offset=${page}&Limit=${limit}`);
    
    if (response.error) {
      console.error(`Failed to fetch lessons for subject ${subjectId}:`, response.error);
      throw new Error(response.error);
    }
    
    return response.data as PaginatedResponse<Lesson>;
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
