import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, Building2, User, DollarSign, FileText, MapPin, Camera, Upload, X } from 'lucide-react';
import Sidebar from "../components/sidebar";
import PropertyService from '../services/propertylistings_service';

interface Property {
  id: number;
  title: string;
  location: string;
  lat: number;
  lng: number;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  description: string;
}

interface PropertyOwnershipFormData {
  propertyAddress: string;
  propertyType: string;
  currentOwnerName: string;
  currentOwnerPhone: string;
  currentOwnerEmail: string;
  newOwnerName: string;
  newOwnerPhone: string;
  newOwnerEmail: string;
  transactionType: string;
  salePrice: string;
  transferDate: string;
}

interface PropertyImage {
  id: number;
  file: File;
  url: string;
  name: string;
}

const PropertyOwnershipTransfer: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState<PropertyOwnershipFormData>({
    propertyAddress: '',
    propertyType: '',
    currentOwnerName: '',
    currentOwnerPhone: '',
    currentOwnerEmail: '',
    newOwnerName: '',
    newOwnerPhone: '',
    newOwnerEmail: '',
    transactionType: 'sale',
    salePrice: '',
    transferDate: ''
  });

  const [propertyImages, setPropertyImages] = useState<PropertyImage[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const fileArray = Array.from(files);
    
    fileArray.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newImage: PropertyImage = {
            id: Date.now() + Math.random(),
            file: file,
            url: event.target?.result as string,
            name: file.name
          };
          setPropertyImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
    
    // Clear the input so same file can be selected again
    e.target.value = '';
  };

  const removeImage = (imageId: number) => {
    setPropertyImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    console.log('Property images:', propertyImages);
    if (formData.transactionType === 'sale') {
      alert(`Property listed for sale successfully with ${propertyImages.length} photos!`);
    } else {
      alert('Ownership transfer completed successfully!');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 lg:ml-72">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md hover:bg-gray-100">
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Property Sale & Transfer</h1>
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
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Property Sale & Transfer</h1>
            </div>
            <p className="text-gray-600">Sell your property or transfer ownership</p>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-b-xl shadow-lg p-6 space-y-8 mx-4 sm:mx-0">
            
            {/* Property Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-800">Property Information</h2>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="propertyAddress"
                    value={formData.propertyAddress}
                    onChange={handleInputChange}
                    placeholder="Enter property address"
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Property Type</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="condo">Condo</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
            </div>

            {/* Property Photos */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Camera className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-semibold text-gray-800">Property Photos</h2>
                {formData.transactionType === 'transfer' && (
                  <span className="text-sm text-gray-500">(Optional)</span>
                )}
              </div>
              
              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload property photos</p>
                  <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB each</p>
                </label>
              </div>
              
              {/* Image Preview */}
              {propertyImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {propertyImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <p className="text-xs text-gray-600 mt-1 truncate">{image.name}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {propertyImages.length > 0 && (
                <p className="text-sm text-green-600">
                  {propertyImages.length} photo{propertyImages.length !== 1 ? 's' : ''} uploaded
                </p>
              )}
            </div>

            {/* Transaction Type */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-800">What do you want to do?</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.transactionType === 'sale' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="transactionType"
                    value="sale"
                    checked={formData.transactionType === 'sale'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <h3 className="font-medium">Sell Property</h3>
                    <p className="text-sm text-gray-600">List property for sale</p>
                  </div>
                </label>
                
                <label className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.transactionType === 'transfer' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="transactionType"
                    value="transfer"
                    checked={formData.transactionType === 'transfer'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <User className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-medium">Transfer Ownership</h3>
                    <p className="text-sm text-gray-600">Transfer to specific person</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Current Owner */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-800">Current Owner</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="currentOwnerName"
                    value={formData.currentOwnerName}
                    onChange={handleInputChange}
                    placeholder="Enter current owner name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="currentOwnerPhone"
                    value={formData.currentOwnerPhone}
                    onChange={handleInputChange}
                    placeholder="Phone number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="currentOwnerEmail"
                    value={formData.currentOwnerEmail}
                    onChange={handleInputChange}
                    placeholder="Email address"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* New Owner (only show if transfer) */}
            {formData.transactionType === 'transfer' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-green-600" />
                  <h2 className="text-lg font-semibold text-gray-800">New Owner</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="newOwnerName"
                      value={formData.newOwnerName}
                      onChange={handleInputChange}
                      placeholder="Enter new owner name"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="newOwnerPhone"
                      value={formData.newOwnerPhone}
                      onChange={handleInputChange}
                      placeholder="Phone number"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="newOwnerEmail"
                      value={formData.newOwnerEmail}
                      onChange={handleInputChange}
                      placeholder="Email address"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sale/Transfer Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-800">
                  {formData.transactionType === 'sale' ? 'Sale Details' : 'Transfer Details'}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.transactionType === 'sale' ? 'Sale Price' : 'Transfer Value'}
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="salePrice"
                      value={formData.salePrice}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.transactionType === 'sale' ? 'Expected Sale Date' : 'Transfer Date'}
                  </label>
                  <input
                    type="date"
                    name="transferDate"
                    value={formData.transferDate}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t flex justify-center">
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-medium text-sm flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                {formData.transactionType === 'sale' ? 'List Property for Sale' : 'Transfer Ownership'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyOwnershipTransfer;