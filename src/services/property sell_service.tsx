import axios from "axios";
import { createClient } from "@supabase/supabase-js";

/**
 * ================================
 * Supabase Configuration
 * ================================
 */
const supabaseUrl = "https://knovcypcijstnijircoy.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtub3ZjeXBjaWpzdG5pamlyY295Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MjI1NzAsImV4cCI6MjA3MTI5ODU3MH0.sOo40BzZvQU-mcIo8A3QjW6ToXGijnWwe71Qot06cXA";
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * ================================
 * Base URL
 * ================================
 */
const BASE_URL =
  "https://housing-backend-xwrj.onrender.com/api/v1/prop_transfer_route";

/**
 * ================================
 * Helper: Get Auth Token
 * ================================
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem("userToken");
};

/**
 * ================================
 * Upload Image to Supabase
 * ================================
 */
const uploadImageToSupabase = async (file: File): Promise<string> => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()
      .toString(36)
      .substring(2, 9)}-${Date.now()}.${fileExt}`;
    const filePath = `ownership_property/${fileName}`;

    const { data, error } = await supabase.storage
      .from("ownership_property") // Make sure bucket exists in Supabase
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) throw error;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("ownership_property").getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};

/**
 * ================================
 * Property Transfer Service
 * ================================
 */
const PropertyTransferService = {
  /**
   * Transfer a property (with optional image upload)
   */
  transferProperty: async (transferData: any): Promise<any> => {
    try {
      if (transferData.imageFile) {
        const imageUrl = await uploadImageToSupabase(transferData.imageFile);
        transferData.images = [imageUrl];
        delete transferData.imageFile;
      }

      const response = await axios.post(`${BASE_URL}/create`, transferData, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to transfer property";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * Sell a property (with optional image upload)
   */
  sellProperty: async (propertyId: string, sellData: any): Promise<any> => {
    try {
      if (sellData.imageFile) {
        const imageUrl = await uploadImageToSupabase(sellData.imageFile);
        sellData.images = [imageUrl];
        delete sellData.imageFile;
      }

      const response = await axios.post(
        `${BASE_URL}/sell/${propertyId}`,
        sellData,
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
        throw error.response?.data || "Failed to sell property";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * Get transferred properties by userId
   */
  getTransferredPropertiesByUserId: async (
    userId: string
  ): Promise<any[]> => {
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
          error.response?.data || "Failed to fetch transferred properties"
        );
      } else {
        throw "An unexpected error occurred";
      }
    }
  },
};

export default PropertyTransferService;
