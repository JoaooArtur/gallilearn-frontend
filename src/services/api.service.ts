
import { API_BASE_URL } from '@/constants/api';

/**
 * Generic API response interface
 */
interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

/**
 * Service to handle API requests
 */
export const apiService = {
  /**
   * Generic GET request
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const status = response.status;
      
      if (!response.ok) {
        return { 
          error: `Error ${status}: ${response.statusText}`, 
          status 
        };
      }
      
      const data = await response.json();
      return { data, status };
    } catch (error) {
      console.error('API GET request failed:', error);
      return { 
        error: error instanceof Error ? error.message : 'Unknown error', 
        status: 500 
      };
    }
  },

  /**
   * Generic POST request
   */
  async post<T, R>(endpoint: string, body: T): Promise<ApiResponse<R>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      
      const status = response.status;
      
      if (!response.ok) {
        return { 
          error: `Error ${status}: ${response.statusText}`, 
          status 
        };
      }
      
      const data = await response.json();
      return { data, status };
    } catch (error) {
      console.error('API POST request failed:', error);
      return { 
        error: error instanceof Error ? error.message : 'Unknown error', 
        status: 500 
      };
    }
  },

  /**
   * Generic PUT request
   */
  async put<T, R>(endpoint: string, body: T): Promise<ApiResponse<R>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      
      const status = response.status;
      
      if (!response.ok) {
        return { 
          error: `Error ${status}: ${response.statusText}`, 
          status 
        };
      }
      
      const data = await response.json();
      return { data, status };
    } catch (error) {
      console.error('API PUT request failed:', error);
      return { 
        error: error instanceof Error ? error.message : 'Unknown error', 
        status: 500 
      };
    }
  },

  /**
   * Generic DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const status = response.status;
      
      if (!response.ok) {
        return { 
          error: `Error ${status}: ${response.statusText}`, 
          status 
        };
      }
      
      const data = await response.json();
      return { data, status };
    } catch (error) {
      console.error('API DELETE request failed:', error);
      return { 
        error: error instanceof Error ? error.message : 'Unknown error', 
        status: 500 
      };
    }
  },
};
