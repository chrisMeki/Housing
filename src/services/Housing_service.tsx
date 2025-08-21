import axios from "axios";

const BASE_URL =
  "https://housing-backend-xwrj.onrender.com/api/v1/housing_route"; // Replace with actual housing registration route

/**
 * Service for handling housing registration API requests
 */
const HousingRegistrationService = {
  /**
   * Fetch housing registrations by userId
   */
  getHousingRegistrationsByUserId: async (userId: string): Promise<any> => {
    try {
      const response = await axios.get(`${BASE_URL}/getbyuser/${userId}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to retrieve housing registrations for this user";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * Create a new housing registration
   */
  createHousingRegistration: async (registrationData: any): Promise<any> => {
    try {
      const response = await axios.post(`${BASE_URL}/create`, registrationData, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to create housing registration";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * Update an existing housing registration
   */
  updateHousingRegistration: async (registrationId: string, updateData: any): Promise<any> => {
    try {
      const response = await axios.put(`${BASE_URL}/update/${registrationId}`, updateData, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to update housing registration";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * Delete a housing registration
   */
  deleteHousingRegistration: async (registrationId: string): Promise<any> => {
    try {
      const response = await axios.delete(`${BASE_URL}/delete/${registrationId}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to delete housing registration";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },
};

/**
 * Helper function to get the auth token from localStorage
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem("userToken");
};

export default HousingRegistrationService;