import React, { useState } from 'react';
import { Search, MapPin, Filter, Grid, List, Eye, FileText, Calendar, Home, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Users, Building, Clock, Shield, Database, Menu, Bell, Settings, X } from 'lucide-react';
import Sidebar from '../components/sidebar';

const PropertySearch = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    propertyType: '',
    registrationStatus: '',
    region: '',
    district: '',
    priceRange: '',
    landSize: '',
    registrationDate: ''
  });
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Mock property data with African context
  const properties = [
    {
      id: 'PROP001',
      title: 'Residential Plot - Kampala Central',
      type: 'Residential',
      status: 'Registered',
      region: 'Central Uganda',
      district: 'Kampala',
      size: '0.25 acres',
      price: 'USh 450,000,000',
      registrationDate: '2024-03-15',
      owner: 'John Mukasa',
      coordinates: '0.3476° N, 32.5825° E'
    },
    {
      id: 'PROP002',
      title: 'Commercial Building - Lagos Island',
      type: 'Commercial',
      status: 'Pending Registration',
      region: 'Lagos State',
      district: 'Lagos Island',
      size: '0.5 acres',
      price: '₦850,000,000',
      registrationDate: '2024-02-28',
      owner: 'Adebayo Enterprises Ltd',
      coordinates: '6.4541° N, 3.4240° E'
    },
    {
      id: 'PROP003',
      title: 'Agricultural Land - Nakuru County',
      type: 'Agricultural',
      status: 'Registered',
      region: 'Rift Valley',
      district: 'Nakuru',
      size: '5.2 acres',
      price: 'KSh 12,500,000',
      registrationDate: '2024-01-10',
      owner: 'Grace Wanjiku',
      coordinates: '0.3031° S, 36.0800° E'
    },
    {
      id: 'PROP004',
      title: 'Mixed Development - Accra New Town',
      type: 'Mixed Use',
      status: 'Under Review',
      region: 'Greater Accra',
      district: 'Accra Metropolitan',
      size: '1.8 acres',
      price: 'GH₵ 2,850,000',
      registrationDate: '2024-04-02',
      owner: 'New Town Developers',
      coordinates: '5.6037° N, 0.1870° W'
    }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Registered': return 'text-green-700 bg-green-100';
      case 'Pending Registration': return 'text-yellow-700 bg-yellow-100';
      case 'Under Review': return 'text-blue-700 bg-blue-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const PropertyCard = ({ property }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
          {property.status}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          {property.region}, {property.district}
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Type: <span className="font-medium">{property.type}</span></span>
          <span className="text-gray-600">Size: <span className="font-medium">{property.size}</span></span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Owner: <span className="font-medium">{property.owner}</span></span>
          <span className="text-green-600 font-semibold">{property.price}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          Registered: {new Date(property.registrationDate).toLocaleDateString()}
        </div>
      </div>
      
      <div className="flex gap-2">
        <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center">
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </button>
        <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center">
          <FileText className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const PropertyRow = ({ property }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <h3 className="font-semibold text-gray-900">{property.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)} self-start sm:self-auto`}>
              {property.status}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 mt-2 text-sm text-gray-600 space-y-1 sm:space-y-0">
            <span>{property.type}</span>
            <span className="hidden sm:inline">•</span>
            <span>{property.region}, {property.district}</span>
            <span className="hidden sm:inline">•</span>
            <span>{property.size}</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-green-600 font-medium">{property.price}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button className="bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700">
            View
          </button>
          <button className="bg-gray-100 text-gray-700 py-1 px-3 rounded text-sm hover:bg-gray-200">
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-72">
        {/* Mobile Header with Hamburger */}
        <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="text-blue-600 p-2 rounded-md hover:bg-blue-50"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Property Registry</h1>
          <div className="w-6"></div> {/* Spacer for alignment */}
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Page Title - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:block">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Registry Search</h1>
            <p className="text-gray-600 mb-6">African Housing & Land Management System</p>
          </div>

          {/* Search Bar with relocated header controls */}
          <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by property ID, owner name, location, or coordinates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-3 text-gray-600 hover:text-gray-900 border rounded-md hover:bg-gray-50"
              >
                {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex-1 sm:flex-none justify-center"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Search Filters</h3>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="agricultural">Agricultural</option>
                    <option value="industrial">Industrial</option>
                    <option value="mixed">Mixed Use</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Registration Status</label>
                  <select
                    value={filters.registrationStatus}
                    onChange={(e) => handleFilterChange('registrationStatus', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Status</option>
                    <option value="registered">Registered</option>
                    <option value="pending">Pending Registration</option>
                    <option value="review">Under Review</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                  <select
                    value={filters.region}
                    onChange={(e) => handleFilterChange('region', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Regions</option>
                    <option value="central">Central Uganda</option>
                    <option value="lagos">Lagos State</option>
                    <option value="rift">Rift Valley</option>
                    <option value="accra">Greater Accra</option>
                    <option value="western">Western Cape</option>
                    <option value="eastern">Eastern Region</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Land Size</label>
                  <select
                    value={filters.landSize}
                    onChange={(e) => handleFilterChange('landSize', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Any Size</option>
                    <option value="0-1">0-1 acres</option>
                    <option value="1-5">1-5 acres</option>
                    <option value="5-10">5-10 acres</option>
                    <option value="10+">10+ acres</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex gap-3">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Apply Filters
                </button>
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                  Clear All
                </button>
              </div>
            </div>
          )}

          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <p className="text-gray-600">Showing {properties.length} properties</p>
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600">Sort by:</label>
              <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                <option>Registration Date</option>
                <option>Property Value</option>
                <option>Location</option>
                <option>Property Type</option>
              </select>
            </div>
          </div>

          {/* Properties Display */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {properties.map(property => (
                <PropertyRow key={property.id} property={property} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center">
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button className="px-3 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-2 bg-blue-600 text-white rounded-md">1</button>
              <button className="px-3 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50">2</button>
              <button className="px-3 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50">3</button>
              <button className="px-3 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertySearch;