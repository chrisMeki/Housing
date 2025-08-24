import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  Bell,
  Building2,
  User,
  DollarSign,
  FileText,
  MapPin,
  Camera,
  Upload,
  X,
  Home,
  CheckCircle,
} from "lucide-react";
import Sidebar from "../components/sidebar";
import HousingRegistrationService from "../services/Housing_service";
import PropertyTransferService from "../services/property sell_service";
import { createClient } from '@supabase/supabase-js';
import Swal from "sweetalert2";

// Supabase configuration
const supabaseUrl = "https://knovcypcijstnijircoy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtub3ZjeXBjaWpzdG5pamlyY295Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MjI1NzAsImV4cCI6MjA3MTI5ODU3MH0.sOo40BzZvQU-mcIo8A3QjW6ToXGijnWwe71Qot06cXA";
const supabase = createClient(supabaseUrl, supabaseKey);

interface PropertyTransfer {
  _id: string;
  propertyId: {
    address: string;
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    images?: string[];
  };
  currentOwner: {
    fullName: string;
    contactNumber: string;
    email: string;
  };
  newOwner: {
    fullName: string;
    contactNumber: string;
    email: string;
  };
  transferDate: string;
  transferPrice: number;
  photos: Array<{
    name: string;
    url: string;
    uploadDate: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface PropertyTransferFormData {
  propertyId: string;
  currentOwner: {
    fullName: string;
    contactNumber: string;
    email: string;
  };
  newOwner: {
    fullName: string;
    contactNumber: string;
    email: string;
  };
  transferDate: string;
  transferPrice: string;
}

interface PropertyPhoto {
  id: number;
  file: File;
  url: string;
  name: string;
}

interface HouseRegistration {
  _id: string;
  propertyType: string;
  address: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  photos: Array<{
    name: string;
    url: string;
  }>;
  status: string;
}

// API Response types
interface ApiResponse<T> {
  data?: T;
  transfers?: T;
  properties?: T;
  message?: string;
  [key: string]: any;
}

const PropertyOwnershipTransfer: React.FC = () => {
  const [userProperties, setUserProperties] = useState<HouseRegistration[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"transfer" | "transferred">(
    "transfer"
  );
  const [transferredProperties, setTransferredProperties] = useState<
    PropertyTransfer[]
  >([]);
  const [formData, setFormData] = useState<PropertyTransferFormData>({
    propertyId: "",
    currentOwner: {
      fullName: "",
      contactNumber: "",
      email: "",
    },
    newOwner: {
      fullName: "",
      contactNumber: "",
      email: "",
    },
    transferDate: "",
    transferPrice: "",
  });
  const [propertyPhotos, setPropertyPhotos] = useState<PropertyPhoto[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingTransferred, setLoadingTransferred] = useState(false);

  useEffect(() => {
    loadUserProperties();
    extractUserIdFromToken();
  }, []);

  useEffect(() => {
    if (userId) {
      loadTransferredProperties();
    }
  }, [userId]);

  useEffect(() => {
    console.log("User properties updated:", userProperties);
  }, [userProperties]);

  const extractUserIdFromToken = () => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        console.error("No user token found");
        return;
      }

      const tokenParts = userToken.split(".");
      if (tokenParts.length === 3) {
        const tokenPayload = JSON.parse(atob(tokenParts[1]));
        const extractedUserId =
          tokenPayload.userId ||
          tokenPayload.id ||
          tokenPayload.user_id ||
          tokenPayload.sub;
        
        if (extractedUserId) {
          setUserId(extractedUserId);
          console.log("Extracted user ID:", extractedUserId);
        } else {
          console.error("No user ID found in token");
        }
      }
    } catch (decodeError) {
      console.error("Error decoding token:", decodeError);
    }
  };

  const loadUserProperties = async () => {
    setLoadingProperties(true);
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        console.error("No user token found");
        return;
      }

      let userId;
      try {
        const tokenParts = userToken.split(".");
        if (tokenParts.length === 3) {
          const tokenPayload = JSON.parse(atob(tokenParts[1]));
          userId =
            tokenPayload.userId ||
            tokenPayload.id ||
            tokenPayload.user_id ||
            tokenPayload.sub;
        }
      } catch (decodeError) {
        console.error("Error decoding token:", decodeError);
        return;
      }

      if (!userId) {
        console.error("No user ID found in token");
        return;
      }

      console.log("Fetching properties for user ID:", userId);
      const response =
        await HousingRegistrationService.getHousingRegistrationsByUserId(
          userId
        );

      console.log("API response:", response);
      
      // Handle different response structures with proper type checking
      if (Array.isArray(response)) {
        setUserProperties(response);
      } else if (response && typeof response === 'object') {
        const apiResponse = response as ApiResponse<HouseRegistration[]>;
        
        if (Array.isArray(apiResponse.data)) {
          setUserProperties(apiResponse.data);
        } else if (Array.isArray(apiResponse.properties)) {
          setUserProperties(apiResponse.properties);
        } else {
          console.error("Unexpected response format:", response);
          setUserProperties([]);
        }
      } else {
        console.error("Unexpected response format:", response);
        setUserProperties([]);
      }
    } catch (error) {
      console.error("Error loading user properties:", error);
      setUserProperties([]);
    } finally {
      setLoadingProperties(false);
    }
  };

  const loadTransferredProperties = async () => {
    if (!userId) return;
    
    setLoadingTransferred(true);
    try {
      const response = await PropertyTransferService.getTransferredPropertiesByUserId(userId);
      
      // Handle different response structures with proper type checking
      if (Array.isArray(response)) {
        setTransferredProperties(response);
      } else if (response && typeof response === 'object') {
        const apiResponse = response as ApiResponse<PropertyTransfer[]>;
        
        if (Array.isArray(apiResponse.data)) {
          setTransferredProperties(apiResponse.data);
        } else if (Array.isArray(apiResponse.transfers)) {
          setTransferredProperties(apiResponse.transfers);
        } else {
          console.error("Unexpected response format:", response);
          setTransferredProperties([]);
        }
      } else {
        console.error("Unexpected response format:", response);
        setTransferredProperties([]);
      }
    } catch (error) {
      console.error("Error loading transferred properties:", error);
      setTransferredProperties([]);
    } finally {
      setLoadingTransferred(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "propertyId" && value) {
      const selectedProperty = userProperties.find(
        (prop) => prop._id === value
      );
      if (selectedProperty) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          currentOwner: {
            fullName: selectedProperty.ownerName,
            contactNumber: selectedProperty.ownerPhone,
            email: selectedProperty.ownerEmail || "",
          },
        }));
        return;
      }
    }

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    fileArray.forEach((file) => {
      if (file.type.startsWith("image/")) {
        // Validate file size (2MB limit)
        if (file.size > 2 * 1024 * 1024) {
          alert('Each image should be less than 2MB');
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
          const newPhoto: PropertyPhoto = {
            id: Date.now() + Math.random(),
            file: file,
            url: event.target?.result as string,
            name: file.name,
          };
          setPropertyPhotos((prev) => [...prev, newPhoto]);
        };
        reader.readAsDataURL(file);
      }
    });

    e.target.value = "";
  };

  const removePhoto = (photoId: number) => {
    setPropertyPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
  };

  // Function to upload images to Supabase
  const uploadImages = async (files: File[]): Promise<string[]> => {
    try {
      setUploadProgress(0);
      const uploadedUrls: string[] = [];
      
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 9)}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`; // Remove the duplicate folder name

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('ownership_property')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type,
          });

        if (error) {
          console.error("Upload error:", error);
          throw error;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase
          .storage
          .from('ownership_property')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
        setUploadProgress((uploadedUrls.length / files.length) * 100);
      }

      return uploadedUrls;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw new Error('Failed to upload images. Please try again.');
    } finally {
      setUploadProgress(null);
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (
      !formData.propertyId ||
      !formData.currentOwner.fullName ||
      !formData.newOwner.fullName ||
      !formData.transferDate ||
      !formData.transferPrice
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Validate transfer date is not in the past
    const transferDate = new Date(formData.transferDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (transferDate < today) {
      alert("Transfer date cannot be in the past");
      return;
    }

    // Validate transfer price is positive
    if (parseFloat(formData.transferPrice) <= 0) {
      alert("Transfer price must be positive");
      return;
    }

    // Check if userId is available
    if (!userId) {
      alert("User authentication error. Please log in again.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Upload images first if any
      let imageUrls: string[] = [];
      if (propertyPhotos.length > 0) {
        const files = propertyPhotos.map(photo => photo.file);
        imageUrls = await uploadImages(files);
        if (imageUrls.length !== propertyPhotos.length) {
          throw new Error("Failed to upload some images. Please try again.");
        }
      }

      // Prepare the data for the API
      const transferData = {
        propertyId: formData.propertyId,
        currentOwner: formData.currentOwner,
        newOwner: formData.newOwner,
        transferDate: formData.transferDate,
        transferPrice: parseFloat(formData.transferPrice),
        photos: imageUrls.map((url, index) => ({
          name: propertyPhotos[index].name,
          url: url,
          uploadDate: new Date().toISOString()
        })),
        userId: userId // Add the userId to the request
      };

      // Call the service to transfer property
      const response = await PropertyTransferService.transferProperty(transferData);
      
      console.log("Transfer successful:", response);
      
      // Show success alert
      Swal.fire({
        icon: "success",
        title: "Transfer Successful!",
        text: "Property ownership transferred successfully!",
        confirmButtonText: "OK",
      });
      
      // Reset form
      setFormData({
        propertyId: "",
        currentOwner: { fullName: "", contactNumber: "", email: "" },
        newOwner: { fullName: "", contactNumber: "", email: "" },
        transferDate: "",
        transferPrice: "",
      });
      setPropertyPhotos([]);
      
      // Reload transferred properties
      loadTransferredProperties();
      
    } catch (error: any) {
      console.error("Error transferring property:", error);
      alert(error.message || "Failed to transfer property. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Filter approved properties
  const approvedProperties = userProperties.filter(
    (property) =>
      !property.status ||
      property.status.toLowerCase() === "approved" ||
      property.status === "Approved"
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:ml-72">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Property Transfer</h1>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-md hover:bg-gray-100">
              <Bell className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="w-full px-0 sm:px-4 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-t-xl shadow-lg p-6 border-b mx-4 sm:mx-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="w-6 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                Property Ownership Transfer
              </h1>
            </div>
            <p className="text-gray-600">
              Transfer property ownership to a new owner
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white border-b mx-4 sm:mx-0">
            <div className="flex">
              <button
                onClick={() => setActiveTab("transfer")}
                className={`px-6 py-3 font-medium text-sm flex items-center gap-2 ${
                  activeTab === "transfer"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FileText className="w-4 h-4" />
                New Transfer
              </button>
              <button
                onClick={() => setActiveTab("transferred")}
                className={`px-6 py-3 font-medium text-sm flex items-center gap-2 ${
                  activeTab === "transferred"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                Transferred Properties
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "transfer" ? (
            /* Transfer Form Content */
            <div className="bg-white rounded-b-xl shadow-lg p-6 space-y-8 mx-4 sm:mx-0">
              {/* Property Selection */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Select Property
                  </h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property *
                  </label>
                  <select
                    name="propertyId"
                    value={formData.propertyId}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={loadingProperties}
                  >
                    <option value="">
                      {loadingProperties
                        ? "Loading properties..."
                        : approvedProperties.length === 0
                        ? "No properties available for transfer"
                        : "Select a property to transfer"}
                    </option>
                    {approvedProperties.map((property) => (
                      <option key={property._id} value={property._id}>
                        {property.address} - {property.propertyType} (
                        {property.bedrooms} bed, {property.bathrooms} bath)
                      </option>
                    ))}
                  </select>
                  {process.env.NODE_ENV === "development" && (
                    <div className="text-xs text-gray-400 mt-1">
                      Debug: {userProperties.length} properties loaded, {approvedProperties.length} approved
                      {userProperties.length > 0 && (
                        <div>
                          Status values:{" "}
                          {userProperties
                            .map((p) => p.status || "no status")
                            .join(", ")}
                        </div>
                      )}
                    </div>
                  )}
                  {approvedProperties.length === 0 && !loadingProperties && (
                    <p className="text-sm text-gray-500 mt-1">
                      You need to register and get properties approved first before transferring
                      them.
                    </p>
                  )}
                </div>
              </div>

              {/* Property Photos */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Camera className="w-5 h-5 text-orange-600" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Property Photos
                  </h2>
                  <span className="text-sm text-gray-500">(Optional)</span>
                </div>

                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">
                      Click to upload property photos
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG, JPEG up to 2MB each
                    </p>
                  </label>
                </div>

                {/* Upload Progress */}
                {uploadProgress !== null && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                    <p className="text-sm text-gray-600 mt-1">
                      Uploading: {Math.round(uploadProgress)}%
                    </p>
                  </div>
                )}

                {/* Photo Preview */}
                {propertyPhotos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {propertyPhotos.map((photo) => (
                      <div key={photo.id} className="relative group">
                        <img
                          src={photo.url}
                          alt={photo.name}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(photo.id)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <p className="text-xs text-gray-600 mt-1 truncate">
                          {photo.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {propertyPhotos.length > 0 && (
                  <p className="text-sm text-green-600">
                    {propertyPhotos.length} photo
                    {propertyPhotos.length !== 1 ? "s" : ""} ready for upload
                  </p>
                )}
              </div>

              {/* Current Owner */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Current Owner Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="currentOwner.fullName"
                      value={formData.currentOwner.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter current owner's full name"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      name="currentOwner.contactNumber"
                      value={formData.currentOwner.contactNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. +1-555-0123"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="currentOwner.email"
                      value={formData.currentOwner.email}
                      onChange={handleInputChange}
                      placeholder="owner@example.com"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* New Owner */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-green-600" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    New Owner Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="newOwner.fullName"
                      value={formData.newOwner.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter new owner's full name"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      name="newOwner.contactNumber"
                      value={formData.newOwner.contactNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. +1-555-0456"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="newOwner.email"
                      value={formData.newOwner.email}
                      onChange={handleInputChange}
                      placeholder="newowner@example.com"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Transfer Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Transfer Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transfer Price *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        name="transferPrice"
                        value={formData.transferPrice}
                        onChange={handleInputChange}
                        placeholder="0"
                        min="0"
                        step="0.01"
                        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transfer Date *
                    </label>
                    <input
                      type="date"
                      name="transferDate"
                      value={formData.transferDate}
                      onChange={handleInputChange}
                      min={getTodayString()}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t flex justify-center">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || approvedProperties.length === 0 || !userId}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    "Processing..."
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Submit Transfer Request
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Transferred Properties Content */
            <div className="bg-white rounded-b-xl shadow-lg p-6 mx-4 sm:mx-0">
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Transferred Properties
                </h2>
              </div>

              {loadingTransferred ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading transferred properties...</p>
                </div>
              ) : transferredProperties.length === 0 ? (
                <div className="text-center py-12">
                  <Home className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">
                    No transferred properties found.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {transferredProperties.map((transfer) => {
                    // Fix for the error: Check if propertyId exists and has propertyType
                    const propertyType = transfer.propertyId?.propertyType || "Unknown";
                    const capitalizedPropertyType = propertyType && propertyType.charAt
                      ? propertyType.charAt(0).toUpperCase() + propertyType.slice(1)
                      : "Unknown";
                    
                    return (
                      <div
                        key={transfer._id}
                        className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="relative">
                          <img
                            src={
                              transfer.propertyId?.images?.[0] ||
                              transfer.photos[0]?.url ||
                              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                            }
                            alt="Property"
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                            TRANSFERRED
                          </div>
                        </div>

                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-1">
                            {transfer.propertyId?.address || "Unknown Address"}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {capitalizedPropertyType}
                          </p>

                          <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="text-sm">
                              <span className="text-gray-500">Bedrooms:</span>{" "}
                              {transfer.propertyId?.bedrooms || "N/A"}
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-500">Bathrooms:</span>{" "}
                              {transfer.propertyId?.bathrooms || "N/A"}
                            </div>
                            <div className="text-sm col-span-2">
                              <span className="text-gray-500">Area:</span>{" "}
                              {transfer.propertyId?.area ? `${transfer.propertyId.area} sq ft` : "N/A"}
                            </div>
                          </div>

                          <div className="border-t pt-3 mt-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-500">
                                Transfer Price:
                              </span>
                              <span className="font-medium text-green-600">
                                {formatCurrency(transfer.transferPrice)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-500">
                                Transfer Date:
                              </span>
                              <span className="text-sm">
                                {formatDate(transfer.transferDate)}
                              </span>
                            </div>
                          </div>

                          <div className="border-t pt-3 mt-3">
                            <div className="mb-2">
                              <span className="text-sm text-gray-500">From:</span>
                              <p className="text-sm font-medium">
                                {transfer.currentOwner?.fullName || "Unknown"}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">To:</span>
                              <p className="text-sm font-medium">
                                {transfer.newOwner?.fullName || "Unknown"}
                              </p>
                            </div>
                          </div>

                          {transfer.photos && transfer.photos.length > 0 && (
                            <div className="border-t pt-3 mt-3">
                              <span className="text-sm text-gray-500">
                                Photos:
                              </span>
                              <p className="text-sm">
                                {transfer.photos.length} photo
                                {transfer.photos.length !== 1 ? "s" : ""} attached
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyOwnershipTransfer;