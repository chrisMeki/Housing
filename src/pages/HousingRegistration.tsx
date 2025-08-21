import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import {
  MapPin,
  Home,
  User,
  Phone,
  Mail,
  FileText,
  Camera,
  Save,
  X,
  Menu,
  List,
  Plus,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import Sidebar from "../components/sidebar";
import HousingRegistrationService from "../services/Housing_service"; // Adjust the path as needed

interface Coordinates {
  lat: string;
  lng: string;
}

interface Photo {
  name: string;
  url: string;
  file?: File;
}

interface FormData {
  propertyType: string;
  address: string;
  lat: string;
  lng: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  yearBuilt: string;
  description: string;
  amenities: string[];
  photos: Photo[];
}

interface RegisteredHouse {
  lat: string;
  lng: string;
  _id: string;
  propertyType: string;
  address: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  yearBuilt: number;
  description: string;
  amenities: string[];
  photos: any[];
  status: "Pending" | "Approved" | "Rejected" | "Needs Documents";
  createdAt: string;
  updatedAt: string;
}

interface Errors {
  propertyType?: string;
  address?: string;
  ownerName?: string;
  ownerPhone?: string;
}

const HousingRegistration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"register" | "registered">(
    "register"
  );
  const [formData, setFormData] = useState<FormData>({
    propertyType: "",
    address: "",
    lat: "",
    lng: "",
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    yearBuilt: "",
    description: "",
    amenities: [],
    photos: [],
  });

  const [editingHouse, setEditingHouse] = useState<RegisteredHouse | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [registeredHouses, setRegisteredHouses] = useState<RegisteredHouse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch registered houses when component mounts or when activeTab changes to "registered"
  useEffect(() => {
    if (activeTab === "registered") {
      fetchRegisteredHouses();
    }
  }, [activeTab]);

  const fetchRegisteredHouses = async () => {
    setIsLoading(true);
    try {
      const userId = localStorage.getItem("userId"); // Ensure you set this at login
      if (!userId) {
        throw new Error("User ID not found in localStorage");
      }
      const response =
        await HousingRegistrationService.getHousingRegistrationsByUserId(
          userId
        );
      setRegisteredHouses(response.data || response);
    } catch (error) {
      console.error("Failed to fetch registered houses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const propertyTypes: string[] = [
    "Single Family Home",
    "Apartment",
    "Condominium",
    "Townhouse",
    "Duplex",
    "Studio",
    "Commercial",
    "Land",
  ];

  const amenitiesList: string[] = [
    "Parking",
    "Garden",
    "Swimming Pool",
    "Gym",
    "Security",
    "Air Conditioning",
    "Heating",
    "Balcony",
    "Terrace",
    "Elevator",
  ];

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setFormData((prev) => ({
      ...prev,
      photos: [
        ...prev.photos,
        ...files.map((file) => ({
          name: file.name,
          url: URL.createObjectURL(file),
          file: file,
        })),
      ],
    }));
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors: Errors = {};
    if (!formData.propertyType)
      newErrors.propertyType = "Property type is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.ownerName) newErrors.ownerName = "Owner name is required";
    if (!formData.ownerPhone) newErrors.ownerPhone = "Phone number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }

      // Prepare the data in the format the API expects
      const apiData = {
        userId,
        propertyType: formData.propertyType,
        address: formData.address,
        lat: formData.lat,
        lng: formData.lng,
        ownerName: formData.ownerName,
        ownerPhone: formData.ownerPhone,
        ownerEmail: formData.ownerEmail,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : 0,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : 0,
        area: formData.area ? parseInt(formData.area) : 0,
        yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : 0,
        description: formData.description,
        amenities: formData.amenities,
        photos: formData.photos.map(photo => ({
          name: photo.name,
          url: photo.url
        }))
      };

      if (editingHouse) {
        // Update existing house
        await HousingRegistrationService.updateHousingRegistration(editingHouse._id, apiData);
        setSuccessMessage("Property updated successfully!");
      } else {
        // Create new house
        await HousingRegistrationService.createHousingRegistration(apiData);
        setSuccessMessage("Property registered successfully!");
      }
      
      // Show success popup
      setShowSuccessPopup(true);
      
      // Reset form and editing state
      setFormData({
        propertyType: "",
        address: "",
        lat: "",
        lng: "",
        ownerName: "",
        ownerPhone: "",
        ownerEmail: "",
        bedrooms: "",
        bathrooms: "",
        area: "",
        yearBuilt: "",
        description: "",
        amenities: [],
        photos: [],
      });
      setEditingHouse(null);

      // Switch to registered tab after a delay
      setTimeout(() => {
        setActiveTab("registered");
        setShowSuccessPopup(false);
        fetchRegisteredHouses();
      }, 2000);
    } catch (error: any) {
      console.error("Registration failed:", error);
      alert(error.message || "Failed to register property. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (house: RegisteredHouse) => {
    // Populate form with house data for editing
    setFormData({
      propertyType: house.propertyType,
      address: house.address,
      lat: house.lat || "",
      lng: house.lng || "",
      ownerName: house.ownerName,
      ownerPhone: house.ownerPhone,
      ownerEmail: house.ownerEmail || "",
      bedrooms: house.bedrooms.toString(),
      bathrooms: house.bathrooms.toString(),
      area: house.area.toString(),
      yearBuilt: house.yearBuilt.toString(),
      description: house.description,
      amenities: house.amenities,
      photos: house.photos.map(photo => ({
        name: getPhotoName(photo, 0),
        url: getPhotoUrl(photo)
      }))
    });
    
    setEditingHouse(house);
    setActiveTab("register");
    window.scrollTo(0, 0);
  };

  const handleDelete = async (houseId: string) => {
    if (!window.confirm("Are you sure you want to delete this property?")) {
      return;
    }

    try {
      await HousingRegistrationService.deleteHousingRegistration(houseId);
      setSuccessMessage("Property deleted successfully!");
      setShowSuccessPopup(true);
      
      // Refresh the list after a short delay
      setTimeout(() => {
        setShowSuccessPopup(false);
        fetchRegisteredHouses();
      }, 2000);
    } catch (error: any) {
      console.error("Delete failed:", error);
      alert(error.message || "Failed to delete property. Please try again.");
    }
  };

  const cancelEdit = () => {
    setFormData({
      propertyType: "",
      address: "",
      lat: "",
      lng: "",
      ownerName: "",
      ownerPhone: "",
      ownerEmail: "",
      bedrooms: "",
      bathrooms: "",
      area: "",
      yearBuilt: "",
      description: "",
      amenities: [],
      photos: [],
    });
    setEditingHouse(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "Rejected":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "Needs Documents":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Needs Documents":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPhotoUrl = (photo: any): string => {
    if (typeof photo === "string") {
      return photo;
    } else if (photo && typeof photo === "object") {
      return photo.url || photo.path || "";
    }
    return "";
  };

  const getPhotoName = (photo: any, index: number): string => {
    if (typeof photo === "string") {
      return `Photo ${index + 1}`;
    } else if (photo && typeof photo === "object") {
      return photo.name || `Photo ${index + 1}`;
    }
    return `Photo ${index + 1}`;
  };


  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Success!
            </h3>
            <p className="text-gray-600 mb-6">
              {successMessage}
            </p>
            <p className="text-gray-500 text-sm">
              {successMessage.includes("deleted") 
                ? "Updating your properties list..." 
                : "Redirecting to your registered properties..."}
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-72">
        {/* Mobile Sidebar Toggle Button */}
        <div className="lg:hidden p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="text-center mb-8 pt-4 md:pt-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
              <Home className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Housing Management
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              Register and manage properties in the mapping system
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 mb-6">
            <div className="flex">
              <button
                onClick={() => {
                  setActiveTab("register");
                  if (editingHouse) cancelEdit();
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-all duration-200 rounded-l-2xl ${
                  activeTab === "register"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                {editingHouse ? (
                  <>
                    <Edit className="w-5 h-5" />
                    Edit Property
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Register Property
                  </>
                )}
              </button>
              <button
                onClick={() => setActiveTab("registered")}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-all duration-200 rounded-r-2xl ${
                  activeTab === "registered"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <List className="w-5 h-5" />
                Registered Houses ({registeredHouses.length})
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "register" ? (
            /* Registration Form */
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              {editingHouse && (
                <div className="bg-blue-50 p-4 border-b border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Edit className="w-5 h-5 text-blue-600" />
                      <p className="text-blue-700 font-medium">
                        Editing: {editingHouse.propertyType} at {editingHouse.address}
                      </p>
                    </div>
                    <button
                      onClick={cancelEdit}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Cancel Edit
                    </button>
                  </div>
                </div>
              )}
              <form
                onSubmit={handleSubmit}
                className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8"
              >
                {/* Property Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Home className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                      Property Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Type *
                      </label>
                      <select
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70"
                      >
                        <option value="">Select property type</option>
                        {propertyTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      {errors.propertyType && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.propertyType}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Year Built
                      </label>
                      <input
                        type="number"
                        name="yearBuilt"
                        value={formData.yearBuilt}
                        onChange={handleInputChange}
                        placeholder="e.g., 2020"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter complete address"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70"
                      />
                    </div>
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Latitude
                      </label>
                      <input
                        type="text"
                        name="lat"
                        value={formData.lat}
                        onChange={handleInputChange}
                        placeholder="e.g., -17.8265"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Longitude
                      </label>
                      <input
                        type="text"
                        name="lng"
                        value={formData.lng}
                        onChange={handleInputChange}
                        placeholder="e.g., 31.0348"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bedrooms
                      </label>
                      <input
                        type="number"
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                        placeholder="0"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bathrooms
                      </label>
                      <input
                        type="number"
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleInputChange}
                        placeholder="0"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Area (sq ft)
                      </label>
                      <input
                        type="number"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        placeholder="0"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70"
                      />
                    </div>
                  </div>
                </div>

                {/* Owner Information Section */}
                <div className="space-y-6 border-t pt-6 md:pt-8">
                  <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                      Owner Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleInputChange}
                        placeholder="Enter full name"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70"
                      />
                      {errors.ownerName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.ownerName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="ownerPhone"
                          value={formData.ownerPhone}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 123-4567"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70"
                        />
                      </div>
                      {errors.ownerPhone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.ownerPhone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="ownerEmail"
                        value={formData.ownerEmail}
                        onChange={handleInputChange}
                        placeholder="owner@example.com"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70"
                      />
                    </div>
                  </div>
                </div>

                {/* Amenities Section */}
                <div className="space-y-6 border-t pt-6 md:pt-8">
                  <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                      Amenities & Description
                    </h2>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Available Amenities
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      {amenitiesList.map((amenity) => (
                        <label
                          key={amenity}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.amenities.includes(amenity)}
                            onChange={() => handleAmenityChange(amenity)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            {amenity}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Describe your property..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 resize-none"
                    />
                  </div>
                </div>

                {/* Photos Section */}
                <div className="space-y-6 border-t pt-6 md:pt-8">
                  <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Camera className="w-5 h-5 text-orange-600" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                      Property Photos
                    </h2>
                  </div>

                  <div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Camera className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">
                        Click to upload photos
                      </span>
                    </label>

                    {formData.photos.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {formData.photos.map((photo, index) => (
                          <div key={index} className="relative">
                            <img
                              src={photo.url}
                              alt={`Property ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="border-t pt-6 md:pt-8 flex gap-4">
                  {editingHouse && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="flex-1 bg-gray-200 text-gray-800 font-semibold py-4 px-6 rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`${editingHouse ? "flex-1" : "w-full"} bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {editingHouse ? "Updating..." : "Registering..."}
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        {editingHouse ? "Update Property" : "Register Property"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Registered Houses List */
            <div className="space-y-6">
              {isLoading ? (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-12 text-center">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading registered houses...</p>
                </div>
              ) : registeredHouses.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-12 text-center">
                  <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No Properties Registered
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Start by registering your first property
                  </p>
                  <button
                    onClick={() => setActiveTab("register")}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  >
                    Register Property
                  </button>
                </div>
              ) : (
                registeredHouses.map((house) => (
                  <div
                    key={house._id}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-gray-800">
                              {house.propertyType}
                            </h3>
                            <div
                              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                house.status
                              )}`}
                            >
                              {getStatusIcon(house.status)}
                              {house.status}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <MapPin className="w-4 h-4" />
                            <span>{house.address}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>
                              Registered: {formatDate(house.createdAt)}
                            </span>
                            {house.createdAt !== house.updatedAt && (
                              <span>
                                Updated: {formatDate(house.updatedAt)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleEdit(house)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(house._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Display house photos if available */}
                      {house.photos && house.photos.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Photos
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {house.photos.map((photo, index) => {
                              const photoUrl = getPhotoUrl(photo);
                              return photoUrl ? (
                                <div key={index} className="relative group">
                                  <img
                                    src={photoUrl}
                                    alt={getPhotoName(photo, index)}
                                    className="w-full h-32 object-cover rounded-lg"
                                    onError={(e) => {
                                      // If image fails to load, show a placeholder
                                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjNmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iMC4zNWVtIiBmb250LXNpemU9IjE4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZmlsbD0iIzk5OSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg==';
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <a
                                      href={photoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-2 bg-white bg-opacity-80 rounded-full"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </a>
                                  </div>
                                </div>
                              ) : (
                                <div key={index} className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <ImageIcon className="w-8 h-8 text-gray-400" />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-sm text-gray-500">Bedrooms</div>
                          <div className="text-lg font-semibold text-gray-800">
                            {house.bedrooms}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-sm text-gray-500">Bathrooms</div>
                          <div className="text-lg font-semibold text-gray-800">
                            {house.bathrooms}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-sm text-gray-500">Area</div>
                          <div className="text-lg font-semibold text-gray-800">
                            {house.area} sq ft
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-sm text-gray-500">
                            Year Built
                          </div>
                          <div className="text-lg font-semibold text-gray-800">
                            {house.yearBuilt}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Owner Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {house.ownerName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {house.ownerPhone}
                            </span>
                          </div>
                          {house.ownerEmail && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">
                                {house.ownerEmail}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {house.description && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Description
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {house.description}
                          </p>
                        </div>
                      )}

                      {house.amenities.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Amenities
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {house.amenities.map((amenity, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HousingRegistration;