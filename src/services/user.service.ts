import { apiService } from './api.service';
import { useAuth } from '@/context/AuthContext';

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
  friend?: {
    id: string;
    name: string;
    email: string;
  };
}

// Search result interface
export interface StudentSearchResult {
  id: string;
  name: string;
  email: string;
}

// Current student ID
export const CURRENT_STUDENT_ID = '2598dd79-dc06-4140-854f-24da3b87a8c7';

/**
 * Service for user-related API calls
 */
export const userService = {
  /**
   * Get current student profile
   */
  async getCurrentStudent(): Promise<StudentProfile> {
    const response = await apiService.get<StudentProfile>(`/students/${CURRENT_STUDENT_ID}`);
    
    if (response.error) {
      console.error('Failed to fetch student profile:', response.error);
      throw new Error(response.error);
    }
    
    return response.data as StudentProfile;
  },
  
  /**
   * Get student's friends
   */
  async getStudentFriends(studentId: string = CURRENT_STUDENT_ID): Promise<Friend[]> {
    const response = await apiService.get<Friend[]>(`/students/${studentId}/friends`);
    
    if (response.error) {
      console.error('Failed to fetch student friends:', response.error);
      throw new Error(response.error);
    }
    
    return response.data as Friend[];
  },
  
  /**
   * Get friend requests for student
   * @param studentId The ID of the student to get requests for
   */
  async getFriendRequests(studentId: string): Promise<FriendRequest[]> {
    const response = await apiService.get<FriendRequest[]>(`/students/${studentId}/friends/requests`);
    
    if (response.error) {
      console.error('Failed to fetch friend requests:', response.error);
      throw new Error(response.error);
    }
    
    return response.data as FriendRequest[];
  },

  /**
   * Accept a friend request
   * @param studentId The ID of the student accepting the request
   * @param requestId The ID of the friend request
   */
  async acceptFriendRequest(studentId: string, requestId: string): Promise<void> {
    const response = await apiService.put<void, void>(
      `/students/${studentId}/friends/requests/${requestId}/accept`, 
      undefined
    );
    
    if (response.error) {
      console.error('Failed to accept friend request:', response.error);
      throw new Error(response.error);
    }
  },

  /**
   * Reject a friend request
   * @param studentId The ID of the student rejecting the request
   * @param requestId The ID of the friend request
   */
  async rejectFriendRequest(studentId: string, requestId: string): Promise<void> {
    const response = await apiService.put<void, void>(
      `/students/${studentId}/friends/requests/${requestId}/reject`, 
      undefined
    );
    
    if (response.error) {
      console.error('Failed to reject friend request:', response.error);
      throw new Error(response.error);
    }
  },
  
  /**
   * Search for students by name
   */
  async searchStudents(name: string): Promise<StudentSearchResult[]> {
    if (!name || name.length < 2) {
      return [];
    }
    
    const response = await apiService.get<StudentSearchResult[]>(`/students?Name=${encodeURIComponent(name)}`);
    
    if (response.error) {
      console.error('Failed to search students:', response.error);
      throw new Error(response.error);
    }
    
    return response.data as StudentSearchResult[];
  }
};
