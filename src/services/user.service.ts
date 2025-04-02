
import { apiService } from './api.service';

// Student profile interface
export interface StudentProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: string;
  level: number;
  xp: number;
  nextLevelXPNeeded: number;
  daysStreak: number;
  friendsCount: number;
  dateOfBirth: string;
  lastLessonAnswered: string | null;
  createdAt: string;
}

// Friend interface
export interface Friend {
  id: string;
  name: string;
  level: number;
  daysStreak: number;
}

// Friend request interface
export interface FriendRequest {
  id: string;
  studentId: string;
  friendId: string;
  status: string;
  createdAt: string;
}

// Search result interface
export interface StudentSearchResult {
  id: string;
  name: string;
  email: string;
}

// Current student ID - Expose this for other services to use
export const CURRENT_STUDENT_ID = '2598dd79-dc06-4140-854f-24da3b87a8c7';

/**
 * Service for user-related API calls
 */
export const userService = {
  // Make CURRENT_STUDENT_ID accessible via the service
  CURRENT_STUDENT_ID,
  
  /**
   * Get current student profile
   */
  async getCurrentStudent() {
    return await apiService.get<StudentProfile>(`/students/${CURRENT_STUDENT_ID}`);
  },
  
  /**
   * Get student's friends
   */
  async getStudentFriends() {
    return await apiService.get<Friend[]>(`/students/${CURRENT_STUDENT_ID}/friends`);
  },
  
  /**
   * Get friend requests for student
   */
  async getFriendRequests() {
    return await apiService.get<FriendRequest[]>(`/students/${CURRENT_STUDENT_ID}/friends/requests`);
  },
  
  /**
   * Search for students by name
   */
  async searchStudents(name: string) {
    if (!name || name.length < 2) {
      return { data: [], error: null };
    }
    
    return await apiService.get<StudentSearchResult[]>(`/students?Name=${encodeURIComponent(name)}`);
  },

  /**
   * Update Auth0 token in API service if needed
   */
  setAuthToken(token: string) {
    apiService.setAuthToken(token);
  }
};
