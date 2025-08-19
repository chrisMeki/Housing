import axios from "axios";

const BASE_URL = "https://housing-backend-xwrj.onrender.com/api/v1/property_listings_route"; // Replace with actual property route

/**
 * Service for handling property-related API requests
 */
const PropertyService = {
  /**
   * Fetch all properties
   */
  getAllProperties: async (): Promise<any> => {
    try {
      const response = await axios.get(`${BASE_URL}/getall`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to retrieve properties";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * Create a new property
   */
  createProperty: async (propertyData: any): Promise<any> => {
    try {
      const response = await axios.post(`${BASE_URL}/create`, propertyData, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to create property";
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

export default PropertyService;
