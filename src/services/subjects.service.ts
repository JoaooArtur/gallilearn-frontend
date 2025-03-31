
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

// Question interface updated to match API response
export interface Question {
  id: string;
  lessonId: string;
  text: string;
  level: string;
  answers: {
    id: string;
    text: string;
  }[];
  createdAt: string;
}

// Answer response interface
export interface AnswerResponse {
  attemptId: string;
  questionId: string;
  answerId: string;
  correctAnswerId: string;
  isCorrect: boolean;
}

// Attempt interface
export interface AttemptResponse {
  id: string;
  studentId: string;
  subjectId: string;
  lessonId: string;
  createdAt: string;
}

// Student ID (fixed for now as requested)
const STUDENT_ID = '2598dd79-dc06-4140-854f-24da3b87a8c7';

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
   * Get random questions for a lesson
   */
  async getRandomQuestionsByLessonId(subjectId: string, lessonId: string): Promise<Question[]> {
    const response = await apiService.get<Question[]>(`/subjects/${subjectId}/${lessonId}/questions/random`);
    
    if (response.error) {
      console.error(`Failed to fetch questions for lesson ${lessonId}:`, response.error);
      throw new Error(response.error);
    }
    
    return response.data || [];
  },
  
  /**
   * Start a lesson attempt
   */
  async startLessonAttempt(subjectId: string, lessonId: string): Promise<AttemptResponse> {
    const response = await apiService.post<{}, AttemptResponse>(
      `/students/${STUDENT_ID}/${subjectId}/${lessonId}/attempt`,
      {}
    );
    
    if (response.error) {
      console.error(`Failed to start attempt for lesson ${lessonId}:`, response.error);
      throw new Error(response.error);
    }
    
    return response.data as AttemptResponse;
  },
  
  /**
   * Submit answer for a question
   */
  async submitAnswer(
    subjectId: string, 
    lessonId: string, 
    attemptId: string, 
    questionId: string, 
    answerId: string
  ): Promise<AnswerResponse> {
    const response = await apiService.post<{}, AnswerResponse>(
      `/students/${STUDENT_ID}/${subjectId}/${lessonId}/${attemptId}/answer?QuestionId=${questionId}&AnswerId=${answerId}`,
      {}
    );
    
    if (response.error) {
      console.error(`Failed to submit answer for question ${questionId}:`, response.error);
      throw new Error(response.error);
    }
    
    return response.data as AnswerResponse;
  }
};
