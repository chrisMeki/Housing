import axios from "axios";

const BASE_URL =
  "https://housing-backend-xwrj.onrender.com/api/v1/housing_route"; // Replace with actual housing registration route

/**
 * Service for handling housing registration API requests
 */
const HousingRegistrationService = {
  /**
   * Fetch all housing registrations
   */
  getAllHousingRegistrations: async (): Promise<any> => {
    try {
      const response = await axios.get(`${BASE_URL}/getall`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to retrieve housing registrations";
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
};

/**
 * Helper function to get the auth token from localStorage
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem("userToken");
};

export default HousingRegistrationService;
