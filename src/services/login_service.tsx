import axios from "axios";

const BASE_URL = "https://housing-backend-xwrj.onrender.com/api/v1/user_route"; // Replace with actual user route

/**
 * Service for handling user-related API requests, including auth
 */
const UserService = {
  /**
   * User signup
   */
  signup: async (userData: any): Promise<any> => {
    try {
      const response = await axios.post(`${BASE_URL}/signup`, userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to sign up user";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * User login
   */
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<any> => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, credentials, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // Save token to localStorage
      if (response.data.token) {
        localStorage.setItem("userToken", response.data.token);
      }
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to log in";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * Fetch all users
   */
  getAllUsers: async (): Promise<any> => {
    try {
      const response = await axios.get(`${BASE_URL}/getall`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to retrieve users";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * Get a user by ID
   */
  getUserById: async (id: string): Promise<any> => {
    try {
      const response = await axios.get(`${BASE_URL}/get/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to retrieve user";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * Update an existing user
   */
  updateUser: async (id: string, userData: any): Promise<any> => {
    try {
      const response = await axios.put(`${BASE_URL}/update/${id}`, userData, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to update user";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * Delete a user
   */
  deleteUser: async (id: string): Promise<any> => {
    try {
      const response = await axios.delete(`${BASE_URL}/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to delete user";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * User logout
   */
  logout: (): void => {
    localStorage.removeItem("userToken");
  },
};

/**
 * Helper function to get the auth token from localStorage
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem("userToken");
};

export default UserService;
