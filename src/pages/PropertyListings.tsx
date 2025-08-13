import { useState } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Heart, 
  Star,
  Menu,
  Bell,
  Grid,
  List,
  X
} from 'lucide-react';
import Sidebar from "../components/sidebar";

const PropertyListings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [propertyType, setPropertyType] = useState('all');
  const [bedrooms, setBedrooms] = useState('all');
  const [favorites, setFavorites] = useState(new Set());
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  const properties = [
    {
      id: 1,
      title: "Modern Downtown Apartment",
      price: 450000,
      location: "Downtown, City Center",
      bedrooms: 2,
      bathrooms: 2,
      area: 850,
      type: "apartment",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop",
      rating: 4.8,
      features: ["Parking", "Balcony", "Gym"],
      agent: "Sarah Johnson"
    },
    {
      id: 2,
      title: "Luxury Family Villa",
      price: 850000,
      location: "Suburb Heights, North District",
      bedrooms: 4,
      bathrooms: 3,
      area: 2200,
      type: "house",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=250&fit=crop",
      rating: 4.9,
      features: ["Garden", "Pool", "Garage"],
      agent: "Michael Chen"
    },
    {
      id: 3,
      title: "Cozy Studio Loft",
      price: 280000,
      location: "Arts Quarter, East Side",
      bedrooms: 1,
      bathrooms: 1,
      area: 520,
      type: "studio",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=250&fit=crop",
      rating: 4.6,
      features: ["High Ceilings", "Exposed Brick", "Natural Light"],
      agent: "Emma Rodriguez"
    },
    {
      id: 4,
      title: "Waterfront Penthouse",
      price: 1200000,
      location: "Harbor District, Waterfront",
      bedrooms: 3,
      bathrooms: 3,
      area: 1800,
      type: "apartment",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=250&fit=crop",
      rating: 4.9,
      features: ["Ocean View", "Terrace", "Concierge"],
      agent: "David Kim"
    },
    {
      id: 5,
      title: "Suburban Townhouse",
      price: 520000,
      location: "Green Valley, West District",
      bedrooms: 3,
      bathrooms: 2,
      area: 1450,
      type: "townhouse",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop",
      rating: 4.7,
      features: ["Backyard", "Fireplace", "Quiet Street"],
      agent: "Lisa Thompson"
    },
    {
      id: 6,
      title: "Historic Brownstone",
      price: 720000,
      location: "Heritage District, Old Town",
      bedrooms: 3,
      bathrooms: 2,
      area: 1650,
      type: "house",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=250&fit=crop",
      rating: 4.5,
      features: ["Original Features", "Garden", "Character"],
      agent: "Robert Wilson"
    }
  ];

  const toggleFavorite = (propertyId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      return newFavorites;
    });
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = priceRange === 'all' || 
                        (priceRange === '0-300k' && property.price <= 300000) ||
                        (priceRange === '300k-600k' && property.price > 300000 && property.price <= 600000) ||
                        (priceRange === '600k+' && property.price > 600000);
    
    const matchesType = propertyType === 'all' || property.type === propertyType;
    
    const matchesBedrooms = bedrooms === 'all' || 
                           (bedrooms === '1' && property.bedrooms === 1) ||
                           (bedrooms === '2' && property.bedrooms === 2) ||
                           (bedrooms === '3' && property.bedrooms === 3) ||
                           (bedrooms === '4+' && property.bedrooms >= 4);
    
    return matchesSearch && matchesPrice && matchesType && matchesBedrooms;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const PropertyCard = ({ property }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      <div className="relative h-48 overflow-hidden rounded-md mb-4">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={() => toggleFavorite(property.id)}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${
              favorites.has(property.id) 
                ? 'fill-red-500 text-red-500' 
                : 'text-gray-600'
            }`}
          />
        </button>
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium capitalize">
            {property.type}
          </span>
        </div>
      </div>
      
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm text-gray-600">{property.rating}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
        <MapPin className="w-4 h-4 text-gray-400" />
        <span>{property.location}</span>
      </div>
      
      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Bed className="w-4 h-4" />
          <span>{property.bedrooms} bed</span>
        </div>
        <div className="flex items-center gap-1">
          <Bath className="w-4 h-4" />
          <span>{property.bathrooms} bath</span>
        </div>
        <div className="flex items-center gap-1">
          <Square className="w-4 h-4" />
          <span>{property.area} sqft</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {property.features.slice(0, 3).map((feature, index) => (
          <span
            key={index}
            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs"
          >
            {feature}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-bold text-gray-900">
            {formatPrice(property.price)}
          </p>
          <p className="text-sm text-gray-500">Agent: {property.agent}</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
          View Details
        </button>
      </div>
    </div>
  );

  const PropertyRow = ({ property }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:bg-gray-50">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="w-full md:w-64 h-48 overflow-hidden rounded-md flex-shrink-0">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600">{property.rating}</span>
              </div>
              <button
                onClick={() => toggleFavorite(property.id)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <Heart
                  className={`w-5 h-5 ${
                    favorites.has(property.id) 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-gray-400'
                  }`}
                />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{property.location}</span>
          </div>
          
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms} bed</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms} bath</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="w-4 h-4" />
              <span>{property.area} sqft</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {property.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <p className="text-lg font-bold text-gray-900">
            {formatPrice(property.price)}
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
            View Details
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
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-40 bg-white shadow-sm border-b">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-blue-600 text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Property Listings</h1>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Page Title - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:block mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Property Listings</h1>
            <p className="text-gray-600">Find your perfect home from our curated selection</p>
          </div>

          {/* Search and View Controls */}
          <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by location or property..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Prices</option>
                    <option value="0-300k">Under $300k</option>
                    <option value="300k-600k">$300k - $600k</option>
                    <option value="600k+">$600k+</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="studio">Studio</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Any Beds</option>
                    <option value="1">1 Bed</option>
                    <option value="2">2 Beds</option>
                    <option value="3">3 Beds</option>
                    <option value="4+">4+ Beds</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex gap-3">
                <button 
                  onClick={() => setShowFilters(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Apply Filters
                </button>
                <button 
                  onClick={() => {
                    setPriceRange('all');
                    setPropertyType('all');
                    setBedrooms('all');
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}

          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <p className="text-gray-600">{filteredProperties.length} properties found</p>
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600">Sort by:</label>
              <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                <option>Price (High to Low)</option>
                <option>Price (Low to High)</option>
                <option>Newest</option>
                <option>Rating</option>
              </select>
            </div>
          </div>

          {/* Properties Display */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProperties.map(property => (
                <PropertyRow key={property.id} property={property} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredProperties.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
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

export default PropertyListings;