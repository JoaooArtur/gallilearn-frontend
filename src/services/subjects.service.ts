
import { apiService } from './api.service';

// Types
export interface Subject {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  lessonsCount: number;
  completedLessonsCount: number;
  progress: number;
}

export interface Lesson {
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

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
  correctOptionId: string;
}

export interface Option {
  id: string;
  text: string;
}

export interface AnswerSubmission {
  questionId: string;
  selectedOptionId: string;
}

// Student types for other components usage
export interface StudentLesson {
  id: string;
  title: string;
  description: string;
  order: number;
  completed: boolean;
  imageUrl: string;
}

export interface StudentSubject {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  lessonsCount: number;
  completedLessonsCount: number;
  progress: number;
}

export interface AnswerResponse {
  isCorrect: boolean;
  correctAnswerId: string;
  explanation: string;
  questionId?: string;
  answerId?: string;
}

// Subjects service
export const subjectsService = {
  /**
   * Get all subjects available for the student
   */
  async getSubjects() {
    return apiService.get<Subject[]>('/subjects');
  },

  /**
   * Get student subjects with paging
   */
  async getStudentSubjectsPaged(page: number = 1, pageSize: number = 10) {
    return apiService.get<{
      items: StudentSubject[],
      page: {
        number: number,
        size: number,
        totalPages: number,
        totalItems: number,
        hasPrevious: boolean,
        hasNext: boolean
      }
    }>(`/subjects?page=${page}&pageSize=${pageSize}`);
  },

  /**
   * Get a specific subject by ID
   * @param subjectId Subject ID
   */
  async getSubject(subjectId: string) {
    return apiService.get<Subject>(`/subjects/${subjectId}`);
  },

  /**
   * Alias for getSubject
   */
  async getSubjectById(subjectId: string) {
    return this.getSubject(subjectId);
  },

  /**
   * Get all lessons for a subject
   * @param subjectId Subject ID
   */
  async getLessons(subjectId: string) {
    return apiService.get<Lesson[]>(`/subjects/${subjectId}/lessons`);
  },

  /**
   * Get student lessons by subject ID
   */
  async getStudentLessonsBySubjectId(subjectId: string) {
    return apiService.get<StudentLesson[]>(`/subjects/${subjectId}/lessons`);
  },

  /**
   * Get a specific lesson by ID
   * @param subjectId Subject ID
   * @param lessonId Lesson ID
   */
  async getLesson(subjectId: string, lessonId: string) {
    return apiService.get<Lesson>(`/subjects/${subjectId}/lessons/${lessonId}`);
  },

  /**
   * Mark a lesson as completed
   * @param subjectId Subject ID
   * @param lessonId Lesson ID
   */
  async completeLesson(subjectId: string, lessonId: string) {
    return apiService.post(`/subjects/${subjectId}/lessons/${lessonId}/complete`, {});
  },

  /**
   * Submit answers for a quiz
   * @param subjectId Subject ID
   * @param lessonId Lesson ID
   * @param quizId Quiz ID
   * @param answers Quiz answers
   */
  async submitQuizAnswers(
    subjectId: string,
    lessonId: string,
    quizId: string,
    answers: AnswerSubmission[]
  ) {
    return apiService.post(`/subjects/${subjectId}/lessons/${lessonId}/quizzes/${quizId}/submit`, { answers });
  },

  /**
   * Get student subjects
   */
  async getStudentSubjects() {
    return apiService.get<StudentSubject[]>('/subjects');
  },

  /**
   * Get random questions by lesson ID
   */
  async getRandomQuestionsByLessonId(subjectId: string, lessonId: string, count: number = 5) {
    return apiService.get<Question[]>(`/subjects/${subjectId}/lessons/${lessonId}/questions/random?count=${count}`);
  },

  /**
   * Start a lesson attempt
   */
  async startLessonAttempt(subjectId: string, lessonId: string) {
    return apiService.post<{ id: string }>(`/subjects/${subjectId}/lessons/${lessonId}/attempt`, {});
  },

  /**
   * Submit an answer
   */
  async submitAnswer(attemptId: string, questionId: string, selectedOptionId: string) {
    return apiService.post<AnswerResponse>(`/lesson-attempts/${attemptId}/answers`, { 
      questionId, 
      selectedOptionId 
    });
  }
};

// Import user service to use the current student ID
import { userService } from './user.service';
