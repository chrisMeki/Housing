import React, { useState, useEffect, useCallback } from "react";
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
  TrendingUp,
  Calendar,
} from "lucide-react";
import Sidebar from "../components/sidebar";
import HousingRegistrationService from "../services/Housing_service";
import PropertySaleService from "../services/sell_service"; // Import the service

interface PropertySale {
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
  listedPrice: number;
  soldPrice: number;
  dateSold: string;
  photos: Array<{
    name: string;
    url: string;
    uploadDate: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface PropertySaleFormData {
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
  listedPrice: string;
  soldPrice: string;
  dateSold: string;
  imageFile?: File | null;
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

interface PropertyPhoto {
  id: number;
  file: File;
  url: string;
  name: string;
}

const PropertySales: React.FC = () => {
  // Properties
  const [userProperties, setUserProperties] = useState<HouseRegistration[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [loadingSales, setLoadingSales] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"sale" | "sold">("sale");
  const [soldProperties, setSoldProperties] = useState<PropertySale[]>([]);
  const [formData, setFormData] = useState<PropertySaleFormData>({
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
    listedPrice: "",
    soldPrice: "",
    dateSold: "",
    imageFile: null,
  });

  const [propertyPhotos, setPropertyPhotos] = useState<PropertyPhoto[]>([]);

  // Get user ID from token
  const getUserId = useCallback((): string | null => {
    const userToken = localStorage.getItem("userToken");
    if (!userToken) return null;

    try {
      const tokenParts = userToken.split(".");
      if (tokenParts.length === 3) {
        const tokenPayload = JSON.parse(atob(tokenParts[1]));
        return (
          tokenPayload.userId ||
          tokenPayload.id ||
          tokenPayload.user_id ||
          tokenPayload.sub ||
          null
        );
      }
    } catch (decodeError) {
      console.error("Error decoding token:", decodeError);
    }
    return null;
  }, []);

  // Load user properties
  useEffect(() => {
    loadUserProperties();
  }, []);

  // Load sold properties when tab changes
  useEffect(() => {
    if (activeTab === "sold") {
      loadSoldProperties();
    }
  }, [activeTab]);

  const loadUserProperties = useCallback(async () => {
    if (loadingProperties) return;

    setLoadingProperties(true);
    try {
      const userId = getUserId();
      if (!userId) {
        console.error("No user ID found");
        setUserProperties([]);
        return;
      }

      const response =
        await HousingRegistrationService.getHousingRegistrationsByUserId(
          userId
        );
      setUserProperties(response.data || []);
    } catch (error) {
      console.error("Error loading user properties:", error);
      setUserProperties([]);
    } finally {
      setLoadingProperties(false);
    }
  }, [loadingProperties, getUserId]);

  const loadSoldProperties = useCallback(async () => {
    setLoadingSales(true);
    try {
      const userId = getUserId();
      if (!userId) {
        console.error("No user ID found");
        setSoldProperties([]);
        return;
      }

      const response = await PropertySaleService.getSalesByUser_Id(userId);
      
      // Handle different API response structures
      let salesData = [];
      
    
      console.log("Sales data:", salesData);
      setSoldProperties(salesData || []);
    } catch (error) {
      console.error("Error loading sold properties:", error);
      alert("Failed to load sold properties");
      setSoldProperties([]);
    } finally {
      setLoadingSales(false);
    }
  }, [getUserId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Auto-populate current owner info when property is selected
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

  const handleSubmit = async () => {
    // Validate required fields
    if (
      !formData.propertyId ||
      !formData.currentOwner.fullName ||
      !formData.newOwner.fullName ||
      !formData.listedPrice ||
      !formData.soldPrice ||
      !formData.dateSold
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Validate date sold is not in the future
    const soldDate = new Date(formData.dateSold);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (soldDate > today) {
      alert("Date sold cannot be in the future");
      return;
    }

    // Validate prices are positive
    if (
      parseFloat(formData.listedPrice) <= 0 ||
      parseFloat(formData.soldPrice) <= 0
    ) {
      alert("Listed price and sold price must be positive");
      return;
    }

    setSubmitting(true);
    try {
      // Get user ID from token
      const userId = getUserId();
      if (!userId) {
        alert("User not authenticated. Please log in again.");
        return;
      }

      // Prepare data for API
      const saleData = {
        propertyId: formData.propertyId,
        currentOwner: formData.currentOwner,
        newOwner: formData.newOwner,
        listedPrice: parseFloat(formData.listedPrice),
        soldPrice: parseFloat(formData.soldPrice),
        dateSold: formData.dateSold,
        userId: userId, // Add userId to the request
        // Use the first photo if available
        imageFile: propertyPhotos.length > 0 ? propertyPhotos[0].file : null,
      };

      // Call the service to create the sale
      const response = await PropertySaleService.createSale(saleData);
      
      alert("Property sale recorded successfully!");
      console.log("Sale created:", response);

      // Reset form
      setFormData({
        propertyId: "",
        currentOwner: { fullName: "", contactNumber: "", email: "" },
        newOwner: { fullName: "", contactNumber: "", email: "" },
        listedPrice: "",
        soldPrice: "",
        dateSold: "",
        imageFile: null,
      });
      setPropertyPhotos([]);
      
      // Refresh sold properties list
      if (activeTab === "sold") {
        loadSoldProperties();
      }
    } catch (error: any) {
      console.error("Error creating property sale:", error);
      alert(error.message || "Failed to record property sale");
    } finally {
      setSubmitting(false);
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

  const calculatePriceDifference = (listed: number, sold: number) => {
    const difference = sold - listed;
    const percentage = ((difference / listed) * 100).toFixed(1);
    return { difference, percentage };
  };

  // Get today's date in YYYY-MM-DD format for date input max value
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

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
          <h1 className="text-xl font-bold text-gray-800">Property Sales</h1>
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
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                Property Sales Management
              </h1>
            </div>
            <p className="text-gray-600">
              Record and track property sales transactions
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white border-b mx-4 sm:mx-0">
            <div className="flex">
              <button
                onClick={() => setActiveTab("sale")}
                className={`px-6 py-3 font-medium text-sm flex items-center gap-2 ${
                  activeTab === "sale"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FileText className="w-4 h-4" />
                Record Sale
              </button>
              <button
                onClick={() => setActiveTab("sold")}
                className={`px-6 py-3 font-medium text-sm flex items-center gap-2 ${
                  activeTab === "sold"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                Sold Properties
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "sale" ? (
            /* Sale Form Content */
            <div className="bg-white rounded-b-xl shadow-lg p-6 space-y-8 mx-4 sm:mx-0">
              {/* Property Selection */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-5 h-5 text-green-600" />
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                    disabled={loadingProperties}
                  >
                    <option value="">
                      {loadingProperties
                        ? "Loading properties..."
                        : userProperties.length === 0
                        ? "No properties available for sale"
                        : "Select a property that was sold"}
                    </option>
                    {userProperties
                      .filter(
                        (property) =>
                          !property.status ||
                          property.status.toLowerCase() === "approved" ||
                          property.status === "Approved"
                      )
                      .map((property) => (
                        <option key={property._id} value={property._id}>
                          {property.address} - {property.propertyType} (
                          {property.bedrooms} bed, {property.bathrooms} bath)
                        </option>
                      ))}
                  </select>
                  {/* Debug info for development */}
                  {process.env.NODE_ENV === "development" && (
                    <div className="text-xs text-gray-400 mt-1">
                      Debug: {userProperties.length} properties loaded
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
                  {userProperties.length === 0 && !loadingProperties && (
                    <p className="text-sm text-gray-500 mt-1">
                      You need to register properties first before recording
                      sales.
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
                      PNG, JPG, JPEG up to 10MB each
                    </p>
                  </label>
                </div>

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
                    {propertyPhotos.length !== 1 ? "s" : ""} uploaded
                  </p>
                )}
              </div>

              {/* Seller Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Seller Information
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
                      placeholder="Enter seller's full name"
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
                      placeholder="seller@example.com"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Buyer Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Buyer Information
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
                      placeholder="Enter buyer's full name"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                      placeholder="buyer@example.com"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Sale Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Sale Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Listed Price *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        name="listedPrice"
                        value={formData.listedPrice}
                        onChange={handleInputChange}
                        placeholder="0"
                        min="0"
                        step="0.01"
                        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sold Price *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        name="soldPrice"
                        value={formData.soldPrice}
                        onChange={handleInputChange}
                        placeholder="0"
                        min="0"
                        step="0.01"
                        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Sold *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        name="dateSold"
                        value={formData.dateSold}
                        onChange={handleInputChange}
                        max={getTodayString()}
                        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Price difference indicator */}
                {formData.listedPrice && formData.soldPrice && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    {(() => {
                      const listed = parseFloat(formData.listedPrice);
                      const sold = parseFloat(formData.soldPrice);
                      const { difference, percentage } =
                        calculatePriceDifference(listed, sold);
                      const isPositive = difference >= 0;

                      return (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            Price difference:
                          </span>
                          <span
                            className={`text-sm font-medium ${
                              isPositive ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {isPositive ? "+" : ""}
                            {formatCurrency(difference)} (
                            {isPositive ? "+" : ""}
                            {percentage}%)
                          </span>
                          {isPositive ? (
                            <span className="text-xs text-green-600">
                              Above listing
                            </span>
                          ) : (
                            <span className="text-xs text-red-600">
                              Below listing
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t flex justify-center">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    "Processing..."
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4" />
                      Record Property Sale
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Sold Properties Content */
            <div className="bg-white rounded-b-xl shadow-lg p-6 mx-4 sm:mx-0">
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Sold Properties
                </h2>
                {loadingSales && (
                  <span className="text-sm text-gray-500">Loading...</span>
                )}
              </div>

              {loadingSales ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading sold properties...</p>
                </div>
              ) : !Array.isArray(soldProperties) || soldProperties.length === 0 ? (
                <div className="text-center py-12">
                  <Home className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No sold properties found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {soldProperties.map((sale) => (
                    <div
                      key={sale._id}
                      className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="relative">
                        <img
                          src={
                            sale.propertyId?.images?.[0] ||
                            sale.photos?.[0]?.url ||
                            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                          }
                          alt="Property"
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                          SOLD
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-1">
                          {sale.propertyId?.address || "Unknown Address"}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {sale.propertyId?.propertyType
                            ? sale.propertyId.propertyType.charAt(0).toUpperCase() +
                              sale.propertyId.propertyType.slice(1)
                            : "Unknown Property Type"}
                        </p>

                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="text-sm">
                            <span className="text-gray-500">Bedrooms:</span>{" "}
                            {sale.propertyId?.bedrooms || "N/A"}
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Bathrooms:</span>{" "}
                            {sale.propertyId?.bathrooms || "N/A"}
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Area:</span>{" "}
                            {sale.propertyId?.area
                              ? sale.propertyId.area.toLocaleString() + " sq ft"
                              : "N/A"}
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Sold:</span>{" "}
                            {formatDate(sale.dateSold)}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                              Listed Price:
                            </span>
                            <span className="text-sm font-medium">
                              {formatCurrency(sale.listedPrice)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                              Sold Price:
                            </span>
                            <span className="text-sm font-semibold text-green-600">
                              {formatCurrency(sale.soldPrice)}
                            </span>
                          </div>

                          {(() => {
                            const { difference, percentage } =
                              calculatePriceDifference(
                                sale.listedPrice,
                                sale.soldPrice
                              );
                            const isPositive = difference >= 0;

                            return (
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">
                                  Difference:
                                </span>
                                <span
                                  className={`text-sm font-medium ${
                                    isPositive
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {isPositive ? "+" : ""}
                                  {percentage}%
                                </span>
                              </div>
                            );
                          })()}
                        </div>

                        <div className="mt-4 pt-3 border-t">
                          <div className="text-xs text-gray-500 mb-1">
                            <strong>Seller:</strong>{" "}
                            {sale.currentOwner?.fullName || "Unknown"}
                          </div>
                          <div className="text-xs text-gray-500">
                            <strong>Buyer:</strong>{" "}
                            {sale.newOwner?.fullName || "Unknown"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertySales;