import React, { useState, useEffect } from 'react';
import { 
  Home, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Search, 
  Filter,
  Settings,
  Eye,
  Heart,
  Share2,
  Bed,
  Bath,
  Square,
  Star,
  ChevronDown,
  PieChart as PieChartIcon,
  BarChart3,
  Plus,
  MapPin,
  Menu,
  Bell,
  Map,
  List,
  FileText,
  User,
  X,
  Edit,
  Upload,
  Image as ImageIcon,
  Camera
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, TooltipProps } from 'recharts';
import Sidebar from "../components/sidebar";
import PropertyService from '../services/propertylistings_service'; // Import the service

interface Property {
  id: number;
  title: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  rating: number;
  image: string;
  status: 'available' | 'pending' | 'rented';
  type: 'apartment' | 'house' | 'penthouse' | 'studio';
}

interface Stat {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  trend: string;
}

interface Activity {
  id: number;
  action: string;
  property: string;
  time: string;
  type: 'listing' | 'rental' | 'tour' | 'inquiry' | 'update';
}

interface ChartData {
  name: string;
  value: number;
  percentage?: number;
}

interface Photo {
  name: string;
  url: string;
  file?: File;
}

interface NewPropertyData {
  userId: string;
  propertyType: string;
  address: string;
  lat: string;
  lng: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  yearBuilt: number;
  description: string;
  amenities: string[];
  photos: Photo[];
}

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [newProperty, setNewProperty] = useState<NewPropertyData>({
    userId: "689cebfebc443e32f31720e5",
    propertyType: "Single Family Home",
    address: "",
    lat: "",
    lng: "",
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    yearBuilt: new Date().getFullYear(),
    description: "",
    amenities: [],
    photos: []
  });
  const [currentAmenity, setCurrentAmenity] = useState("");
  const [uploading, setUploading] = useState(false);

  // Fetch properties on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await PropertyService.getAllProperties();
        // Assuming the API returns data in a format that matches our Property interface
        setProperties(response.data || response); // Adjust based on your API response structure
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch properties');
        console.error('Error fetching properties:', err);
        // Fallback to mock data if API fails
        setProperties(properties);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  
  const stats: Stat[] = [
    { 
      title: "Total Properties", 
      value: properties.length.toString(), 
      change: "+12%", 
      icon: Home, 
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      trend: "up"
    },
    { 
      title: "Active Listings", 
      value: properties.filter(p => p.status === 'available').length.toString(), 
      change: "+8%", 
      icon: TrendingUp, 
      color: "bg-gradient-to-r from-emerald-500 to-emerald-600",
      trend: "up"
    },
    { 
      title: "Total Users", 
      value: "15,678", 
      change: "+23%", 
      icon: Users, 
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      trend: "up"
    },
    { 
      title: "Monthly Revenue", 
      value: "$2.4M", 
      change: "+15%", 
      icon: DollarSign, 
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      trend: "up"
    }
  ];

  const recentActivities: Activity[] = [
    { id: 1, action: "New property listed", property: "Modern Downtown Loft", time: "2 hours ago", type: "listing" },
    { id: 2, action: "Property rented", property: "Garden Apartment", time: "4 hours ago", type: "rental" },
    { id: 3, action: "Tour scheduled", property: "Luxury Penthouse", time: "6 hours ago", type: "tour" },
    { id: 4, action: "Inquiry received", property: "Executive Suite", time: "1 day ago", type: "inquiry" },
    { id: 5, action: "Property updated", property: "Suburban Family Home", time: "2 days ago", type: "update" }
  ];

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || property.status === selectedFilter || property.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const propertyTypeData = properties.reduce((acc: Record<string, number>, property) => {
    acc[property.type] = (acc[property.type] || 0) + 1;
    return acc;
  }, {});

  const statusData = properties.reduce((acc: Record<string, number>, property) => {
    acc[property.status] = (acc[property.status] || 0) + 1;
    return acc;
  }, {});

  const chartData: ChartData[] = Object.entries(propertyTypeData).map(([type, count]) => ({
    name: type,
    value: count
  }));

  const statusChartData: ChartData[] = Object.entries(statusData).map(([status, count]) => ({
    name: status,
    value: count,
    percentage: Math.round((count / properties.length) * 100)
  }));

  const COLORS: Record<string, string> = {
    available: '#10B981',
    pending: '#F59E0B',
    rented: '#3B82F6',
    apartment: '#8B5CF6',
    house: '#EC4899',
    penthouse: '#F97316',
    studio: '#14B8A6'
  };

  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ChartData;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600">
            {data.value} properties ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content - Fixed spacing */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              Housing Dashboard
            </h1>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error} (using mock data)
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-xl lg:rounded-2xl bg-white/80 backdrop-blur-lg border border-white/20 p-4 lg:p-6 shadow hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs lg:text-sm text-emerald-600 font-medium mt-1 lg:mt-2 flex items-center">
                      <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-2 lg:p-3 rounded-xl lg:rounded-2xl ${stat.color} shadow`}>
                    <stat.icon className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 pointer-events-none"></div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
            {/* Property Types Chart */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/20 p-4 lg:p-6 shadow">
              <h2 className="text-base lg:text-lg font-bold text-gray-800 flex items-center mb-3 lg:mb-4">
                <Home className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-blue-600" />
                Property Types Distribution
              </h2>
              <div className="h-48 lg:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[entry.name] || "#9CA3AF"}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 lg:mt-4 space-y-1 lg:space-y-2">
                {chartData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-xs lg:text-sm"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-2 h-2 lg:w-3 lg:h-3 rounded-full mr-1 lg:mr-2"
                        style={{
                          backgroundColor: COLORS[item.name] || "#9CA3AF",
                        }}
                      ></div>
                      <span className="text-gray-700 capitalize">{item.name}</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {item.value} ({Math.round((item.value / properties.length) * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Distribution Chart */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/20 p-4 lg:p-6 shadow">
              <h2 className="text-base lg:text-lg font-bold text-gray-800 flex items-center mb-3 lg:mb-4">
                <BarChart3 className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-blue-600" />
                Property Status Overview
              </h2>
              <div className="h-48 lg:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={40}
                      fontSize={10}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/20 p-4 lg:p-6 mb-6 lg:mb-8 shadow">
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 items-center justify-between">
              <div className="relative flex-1 w-full lg:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5" />
                <input
                  type="text"
                  placeholder="Search properties, locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 lg:pl-10 pr-4 py-2 lg:py-3 rounded-lg lg:rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all text-sm lg:text-base"
                />
              </div>
              
              <div className="flex items-center space-x-2 lg:space-x-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:flex-none">
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="appearance-none w-full bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg lg:rounded-xl px-3 lg:px-4 py-2 lg:py-3 pr-7 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm lg:text-base"
                  >
                    <option value="all">All Properties</option>
                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="rented">Rented</option>
                    <option value="apartment">Apartments</option>
                    <option value="house">Houses</option>
                    <option value="studio">Studios</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                
                <button className="flex items-center space-x-1 lg:space-x-2 px-3 lg:px-4 py-2 lg:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg lg:rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow hover:shadow-md text-sm lg:text-base">
                  <Filter className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
            {/* Properties Grid */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/20 p-4 lg:p-6 shadow mb-6 lg:mb-8">
                <div className="flex items-center justify-between mb-4 lg:mb-6">
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Property Listings</h2>
                  <div className="flex items-center space-x-1 lg:space-x-2">
                    <button className="p-1 lg:p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <BarChart3 className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
                    </button>
                    <button className="p-1 lg:p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <PieChartIcon className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                    {filteredProperties.map((property) => (
                      <div
                        key={property.id}
                        className="bg-white/60 backdrop-blur-sm rounded-lg lg:rounded-xl overflow-hidden border border-white/30 cursor-pointer transition-all duration-300 hover:shadow-md hover:bg-white/80 hover:-translate-y-1"
                        onMouseEnter={() => setHoveredCard(property.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <div className="relative">
                          <img
                            src={property.image}
                            alt={property.title}
                            className="w-full h-40 lg:h-48 object-cover"
                          />
                          <div className={`absolute top-2 left-2 px-2 py-0.5 lg:px-3 lg:py-1 rounded-full text-xs font-medium ${
                            property.status === 'available' ? 'bg-green-100 text-green-800' :
                            property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {property.status}
                          </div>
                          
                          {hoveredCard === property.id && (
                            <div className="absolute top-2 right-2 flex space-x-1 lg:space-x-2">
                              <button className="p-1 lg:p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                                <Heart className="w-3 h-3 lg:w-4 lg:h-4 text-gray-600" />
                              </button>
                              <button className="p-1 lg:p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                                <Share2 className="w-3 h-3 lg:w-4 lg:h-4 text-gray-600" />
                              </button>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-3 lg:p-4">
                          <h3 className="font-semibold text-gray-900 text-sm lg:text-base mb-1">{property.title}</h3>
                          <p className="text-blue-600 font-bold text-lg lg:text-xl mb-1 lg:mb-2">{property.price}</p>
                          <p className="text-gray-500 text-xs lg:text-sm flex items-center mb-2 lg:mb-3">
                            <MapPin className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                            {property.location}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 lg:space-y-4 text-xs lg:text-sm text-gray-600">
                              <span className="flex items-center">
                                <Bed className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                                {property.beds}
                              </span>
                              <span className="flex items-center">
                                <Bath className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                                {property.baths}
                              </span>
                              <span className="flex items-center">
                                <Square className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                                {property.sqft}ft²
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Star className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-400 mr-1" />
                              <span className="text-xs lg:text-sm font-medium">{property.rating}</span>
                            </div>
                          </div>
                          
                          {hoveredCard === property.id && (
                            <div className="mt-2 lg:mt-4 pt-2 lg:pt-4 border-t border-gray-200">
                              <button 
                                className="w-full bg-blue-500 text-white py-1 lg:py-2 px-3 lg:px-4 rounded-md lg:rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center text-xs lg:text-sm"
                                onClick={() => setSelectedProperty(property)}
                              >
                                <Eye className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                                View Details
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 lg:space-y-6">
              {/* Recent Activity */}
              <div className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/20 p-4 lg:p-6 shadow">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Recent Activity</h3>
                
                <div className="space-y-2 lg:space-y-3">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-2 lg:space-x-3 p-2 lg:p-3 bg-white/50 rounded-md lg:rounded-lg">
                      <div className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full mt-1.5 lg:mt-2 ${
                        activity.type === 'listing' ? 'bg-green-500' :
                        activity.type === 'rental' ? 'bg-blue-500' :
                        activity.type === 'tour' ? 'bg-purple-500' :
                        activity.type === 'inquiry' ? 'bg-orange-500' :
                        'bg-gray-500'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs lg:text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs lg:text-sm text-gray-600 truncate">{activity.property}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/20 p-4 lg:p-6 shadow">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Quick Stats</h3>
                <div className="space-y-3 lg:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs lg:text-sm text-gray-600">Occupancy Rate</span>
                    <span className="text-xs lg:text-sm font-semibold text-green-600">94.2%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 lg:h-2">
                    <div className="bg-green-500 h-1.5 lg:h-2 rounded-full" style={{width: '94.2%'}}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs lg:text-sm text-gray-600">Average Rent</span>
                    <span className="text-xs lg:text-sm font-semibold text-blue-600">$2,850</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs lg:text-sm text-gray-600">Properties Sold</span>
                    <span className="text-xs lg:text-sm font-semibold text-purple-600">127 this month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Details Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-xl w-full max-w-md lg:max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold flex items-center">
                    <Home className="w-5 h-5 lg:w-6 lg:h-6 mr-2" />
                    {selectedProperty.title}
                  </h2>
                  <p className="text-blue-100 text-xs lg:text-sm mt-1">{selectedProperty.location}</p>
                </div>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="p-1 lg:p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>
              </div>
            </div>

            <div className="p-4 lg:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                {/* Property Image */}
                <div className="col-span-2">
                  <img
                    src={selectedProperty.image}
                    alt={selectedProperty.title}
                    className="w-full h-40 lg:h-48 object-cover rounded-lg"
                  />
                </div>

                {/* Property Details */}
                <div>
                  <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-2 lg:mb-3">Details</h3>
                  <div className="space-y-2 lg:space-y-3">
                    <div>
                      <label className="text-xs lg:text-sm font-medium text-gray-600">Price</label>
                      <p className="text-blue-600 font-bold text-sm lg:text-base">{selectedProperty.price}</p>
                    </div>
                    <div>
                      <label className="text-xs lg:text-sm font-medium text-gray-600">Status</label>
                      <div className="flex items-center">
                        <span className={`inline-flex px-2 py-0.5 lg:px-3 lg:py-1 rounded-full text-xs font-medium ${
                          selectedProperty.status === 'available' ? 'bg-green-100 text-green-800' :
                          selectedProperty.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {selectedProperty.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs lg:text-sm font-medium text-gray-600">Type</label>
                      <p className="text-gray-900 capitalize text-sm lg:text-base">{selectedProperty.type}</p>
                    </div>
                  </div>
                </div>

                {/* Property Features */}
                <div>
                  <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-2 lg:mb-3">Features</h3>
                  <div className="grid grid-cols-2 gap-2 lg:gap-3">
                    <div className="flex items-center text-xs lg:text-sm">
                      <Bed className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500 mr-1 lg:mr-2" />
                      <span>{selectedProperty.beds} Beds</span>
                    </div>
                    <div className="flex items-center text-xs lg:text-sm">
                      <Bath className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500 mr-1 lg:mr-2" />
                      <span>{selectedProperty.baths} Baths</span>
                    </div>
                    <div className="flex items-center text-xs lg:text-sm">
                      <Square className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500 mr-1 lg:mr-2" />
                      <span>{selectedProperty.sqft} ft²</span>
                    </div>
                    <div className="flex items-center text-xs lg:text-sm">
                      <Star className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-400 mr-1 lg:mr-2" />
                      <span>{selectedProperty.rating} Rating</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="col-span-2 flex justify-end space-x-2 lg:space-x-3 pt-3 lg:pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedProperty(null)}
                    className="px-4 lg:px-6 py-1.5 lg:py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-xs lg:text-sm"
                  >
                    Close
                  </button>
                  <button className="px-4 lg:px-6 py-1.5 lg:py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center text-xs lg:text-sm">
                    <Edit className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                    Edit Property
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;