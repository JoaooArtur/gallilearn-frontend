
/**
 * API Service for making HTTP requests
 */
export const apiService = {
  baseUrl: 'https://localhost:7171/api/v1',
  authToken: '',

  /**
   * Set the authentication token for API requests
   * @param token The authentication token
   */
  setAuthToken(token: string) {
    this.authToken = token;
  },

  /**
   * Get default headers for API requests
   */
  getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  },

  /**
   * Make a GET request
   * @param endpoint API endpoint
   */
  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error('API GET error:', error);
      throw error;
    }
  },

  /**
   * Make a POST request
   * @param endpoint API endpoint
   * @param body Request body
   */
  async post<T>(endpoint: string, body: any): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error('API POST error:', error);
      throw error;
    }
  },

  /**
   * Make a PUT request
   * @param endpoint API endpoint
   * @param body Request body
   */
  async put<T>(endpoint: string, body: any): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error('API PUT error:', error);
      throw error;
    }
  },

  /**
   * Make a DELETE request
   * @param endpoint API endpoint
   */
  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error('API DELETE error:', error);
      throw error;
    }
  },
};
