import axios from "axios";

const BASE_URL =
  "https://housing-backend-xwrj.onrender.com/api/v1/reports_route";

/**
 * Service for handling report-related API requests
 */
const ReportsService = {
  /**
   * Fetch all reports
   */
  getAllReports: async (): Promise<any> => {
    try {
      const response = await axios.get(`${BASE_URL}/getall`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to retrieve reports";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * Get a report by ID
   */
  getReportById: async (id: string): Promise<any> => {
    try {
      const response = await axios.get(`${BASE_URL}/get/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to retrieve report";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * Get reports by User ID
   */
  getReportsByUserId: async (userId: string): Promise<any> => {
    try {
      const response = await axios.get(`${BASE_URL}/get/${userId}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to retrieve user reports";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * Create a new report
   */
  createReport: async (reportData: any): Promise<any> => {
    try {
      const response = await axios.post(`${BASE_URL}/create`, reportData, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to create report";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * Update an existing report
   */
  updateReport: async (id: string, reportData: any): Promise<any> => {
    try {
      const response = await axios.put(`${BASE_URL}/update/${id}`, reportData, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to update report";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * Delete a report
   */
  deleteReport: async (id: string): Promise<any> => {
    try {
      const response = await axios.delete(`${BASE_URL}/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to delete report";
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

export default ReportsService;
