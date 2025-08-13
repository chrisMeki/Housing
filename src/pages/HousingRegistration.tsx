import React, { useState, ChangeEvent, FormEvent } from 'react';
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
  Bell,
  Settings
} from 'lucide-react';
import Sidebar from "../components/sidebar";

interface Coordinates {
  lat: string;
  lng: string;
}

interface Photo {
  name: string;
  url: string;
}

interface FormData {
  propertyType: string;
  address: string;
  coordinates: Coordinates;
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

interface Errors {
  propertyType?: string;
  address?: string;
  ownerName?: string;
  ownerPhone?: string;
}

const HousingRegistration: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    propertyType: '',
    address: '',
    coordinates: { lat: '', lng: '' },
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    yearBuilt: '',
    description: '',
    amenities: [],
    photos: []
  });

  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const propertyTypes: string[] = [
    'Single Family Home',
    'Apartment',
    'Condominium',
    'Townhouse',
    'Duplex',
    'Studio',
    'Commercial',
    'Land'
  ];

  const amenitiesList: string[] = [
    'Parking',
    'Garden',
    'Swimming Pool',
    'Gym',
    'Security',
    'Air Conditioning',
    'Heating',
    'Balcony',
    'Terrace',
    'Elevator'
  ];

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...(prev as any)[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAmenityChange = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setFormData(prev => ({
      ...prev,
      photos: [
        ...prev.photos,
        ...files.map(file => ({
          name: file.name,
          url: URL.createObjectURL(file)
        }))
      ]
    }));
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors: Errors = {};
    if (!formData.propertyType)
      newErrors.propertyType = 'Property type is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.ownerName) newErrors.ownerName = 'Owner name is required';
    if (!formData.ownerPhone)
      newErrors.ownerPhone = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);

    alert('Property registered successfully!');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

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
          <div className="text-center mb-8 pt-4 md:pt-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
              <Home className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Housing Registration
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              Register your property in our mapping system
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8">
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
                      {propertyTypes.map(type => (
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
                    {amenitiesList.map(amenity => (
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
                        <span className="text-sm text-gray-700">{amenity}</span>
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
              <div className="border-t pt-6 md:pt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Registering Property...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Register Property
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HousingRegistration;