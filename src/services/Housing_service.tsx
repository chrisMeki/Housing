import axios from "axios";
import { createClient } from "@supabase/supabase-js";


// Supabase Configuration
const supabaseUrl = "https://knovcypcijstnijircoy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtub3ZjeXBjaWpzdG5pamlyY295Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MjI1NzAsImV4cCI6MjA3MTI5ODU3MH0.sOo40BzZvQU-mcIo8A3QjW6ToXGijnWwe71Qot06cXA";
const supabase = createClient(supabaseUrl, supabaseKey);


const BASE_URL =
  "https://housing-backend-xwrj.onrender.com/api/v1/housing_route"; // Replace with actual housing registration route

/**
 * Upload image to Supabase Storage
 */
const uploadImageToSupabase = async (file: File): Promise<string> => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()
      .toString(36)
      .substring(2, 9)}-${Date.now()}.${fileExt}`;
    const filePath = `housing_registration/${fileName}`;

    const { data, error } = await supabase.storage
      .from("housing_registration") // Make sure bucket "housing-images" exists in Supabase
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) throw error;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("housing_registration").getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};

/**
 * Housing Registration Service
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
        throw (
          error.response?.data ||
          "Failed to retrieve housing registrations for this user"
        );
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * Create a new housing registration (with optional photo upload to Supabase)
   */
  createHousingRegistration: async (registrationData: any): Promise<any> => {
    try {
      // Handle image upload if File is provided
      if (registrationData.imageFile) {
        const imageUrl = await uploadImageToSupabase(
          registrationData.imageFile
        );
        registrationData.images = [imageUrl]; // Store uploaded image URL
        delete registrationData.imageFile; // Remove file before sending
      }

      const response = await axios.post(
        `${BASE_URL}/create`,
        registrationData,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
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
   * Update an existing housing registration (with optional new photo upload)
   */
  updateHousingRegistration: async (
    registrationId: string,
    updateData: any
  ): Promise<any> => {
    try {
      // Handle new image upload if provided
      if (updateData.imageFile) {
        const imageUrl = await uploadImageToSupabase(updateData.imageFile);
        updateData.images = [imageUrl];
        delete updateData.imageFile;
      }

      const response = await axios.put(
        `${BASE_URL}/update/${registrationId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
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
      const response = await axios.delete(
        `${BASE_URL}/delete/${registrationId}`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
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
