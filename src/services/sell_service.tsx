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
  "https://housing-backend-xwrj.onrender.com/api/v1/prop_sale_route";

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
    const filePath = `sell_property/${fileName}`;

    const { data, error } = await supabase.storage
      .from("sell_property")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) throw error;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("sell_property").getPublicUrl(data.path);

    console.log("✅ Image uploaded successfully:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("❌ Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};

/**
 * ================================
 * Property Sale Service
 * ================================
 */
const PropertySaleService = {
  /**
   * Create a property sale (with optional image upload)
   */
  createSale: async (saleData: any): Promise<any> => {
    try {
      if (saleData.imageFile) {
        const imageUrl = await uploadImageToSupabase(saleData.imageFile);
        saleData.images = [imageUrl];
        delete saleData.imageFile;
      }

      const response = await axios.post(`${BASE_URL}/create`, saleData, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Property sale created successfully:", response.data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("❌ Failed to create property sale:", error.response?.data);
        throw error.response?.data || "Failed to create property sale";
      } else {
        console.error("❌ An unexpected error occurred:", error);
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * Get property sales by userId
   */
  getSalesByUser_Id: async (user_Id: string): Promise<any[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/getbyuser/${user_Id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      console.log(`✅ Sales fetched successfully for user ${user_Id}:`, response.data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("❌ Failed to fetch property sales:", error.response?.data);
        throw error.response?.data || "Failed to fetch property sales";
      } else {
        console.error("❌ An unexpected error occurred:", error);
        throw "An unexpected error occurred";
      }
    }
  },
};

export default PropertySaleService;
