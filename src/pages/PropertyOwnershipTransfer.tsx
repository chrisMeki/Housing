import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, Building2, User, DollarSign, FileText, MapPin, Camera, Upload, X, Home, CheckCircle } from 'lucide-react';
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
  status: 'available' | 'sold' | 'transferred';
  soldDate?: string;
  soldPrice?: number;
  newOwner?: string;
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
  const [activeTab, setActiveTab] = useState<'transfer' | 'sold'>('transfer');
  const [soldProperties, setSoldProperties] = useState<Property[]>([]);
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

  // Mock data for sold properties (in a real app, this would come from an API)
  useEffect(() => {
    const mockSoldProperties: Property[] = [
      {
        id: 1,
        title: "Luxury Villa in Beverly Hills",
        location: "Beverly Hills, CA",
        lat: 34.0736,
        lng: -118.4004,
        price: 4500000,
        type: "house",
        bedrooms: 5,
        bathrooms: 4,
        area: 4500,
        image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        description: "Stunning luxury villa with panoramic city views",
        status: 'sold',
        soldDate: '2023-10-15',
        soldPrice: 4450000,
        newOwner: 'John Smith'
      },
      {
        id: 2,
        title: "Modern Downtown Apartment",
        location: "New York, NY",
        lat: 40.7128,
        lng: -74.0060,
        price: 1250000,
        type: "apartment",
        bedrooms: 3,
        bathrooms: 2,
        area: 1800,
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        description: "Brand new apartment in the heart of Manhattan",
        status: 'transferred',
        soldDate: '2023-09-22',
        soldPrice: 1225000,
        newOwner: 'Sarah Johnson'
      },
      {
        id: 3,
        title: "Beachfront Property",
        location: "Miami, FL",
        lat: 25.7617,
        lng: -80.1918,
        price: 3200000,
        type: "house",
        bedrooms: 4,
        bathrooms: 3,
        area: 3800,
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        description: "Beautiful beachfront property with private access",
        status: 'sold',
        soldDate: '2023-11-05',
        soldPrice: 3150000,
        newOwner: 'Michael Rodriguez'
      }
    ];
    
    setSoldProperties(mockSoldProperties);
  }, []);

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

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
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

          {/* Tabs */}
          <div className="bg-white border-b mx-4 sm:mx-0">
            <div className="flex">
              <button
                onClick={() => setActiveTab('transfer')}
                className={`px-6 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === 'transfer' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <FileText className="w-4 h-4" />
                Property Transfer
              </button>
              <button
                onClick={() => setActiveTab('sold')}
                className={`px-6 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === 'sold' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <CheckCircle className="w-4 h-4" />
                Sold Properties
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'transfer' ? (
            /* Transfer Form Content */
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
          ) : (
            /* Sold Properties Content */
            <div className="bg-white rounded-b-xl shadow-lg p-6 mx-4 sm:mx-0">
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-800">Sold & Transferred Properties</h2>
              </div>
              
              {soldProperties.length === 0 ? (
                <div className="text-center py-12">
                  <Home className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No sold or transferred properties found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {soldProperties.map(property => (
                    <div key={property.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative">
                        <img 
                          src={property.image} 
                          alt={property.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                          {property.status === 'sold' ? 'SOLD' : 'TRANSFERRED'}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-1">{property.title}</h3>
                        <p className="text-gray-600 text-sm mb-2 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {property.location}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="text-sm">
                            <span className="text-gray-500">Bedrooms:</span> {property.bedrooms}
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Bathrooms:</span> {property.bathrooms}
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Area:</span> {property.area} sq ft
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Type:</span> {property.type}
                          </div>
                        </div>
                        
                        <div className="border-t pt-3 mt-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-500">Listed Price:</span>
                            <span className="font-medium">{formatCurrency(property.price)}</span>
                          </div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-500">Sold Price:</span>
                            <span className="font-medium text-green-600">{formatCurrency(property.soldPrice || 0)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Date:</span>
                            <span className="text-sm">{formatDate(property.soldDate || '')}</span>
                          </div>
                          <div className="mt-2 pt-2 border-t">
                            <span className="text-sm text-gray-500">New Owner:</span>
                            <p className="text-sm font-medium">{property.newOwner}</p>
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

export default PropertyOwnershipTransfer;