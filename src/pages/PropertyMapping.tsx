import React, { useState, useEffect, useRef } from 'react';
import { Home, MapPin, Menu, Bell, X } from 'lucide-react';
import Sidebar from '../components/sidebar';

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

interface Filters {
  propertyType: string;
  priceRange: string;
  minBedrooms: string;
}

interface Marker {
  main: any;
  split: any;
  property: Property;
}

const PropertyMapping: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [currentView, setCurrentView] = useState<'map' | 'split' | 'list'>('map');
  const [highlightedProperty, setHighlightedProperty] = useState<number | null>(null);
  const [filters, setFilters] = useState<Filters>({
    propertyType: '',
    priceRange: '',
    minBedrooms: ''
  });

  // Property data
  const properties: Property[] = [
    {
      id: 1,
      title: "Modern Downtown Apartment",
      location: "Downtown, New York",
      lat: 40.7589,
      lng: -73.9851,
      price: 750000,
      type: "apartment",
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Stunning modern apartment in the heart of downtown with panoramic city views."
    },
    // ... (rest of your property data remains the same)
  ];

  // Refs for maps
  const mapRef = useRef<HTMLDivElement>(null);
  const mapSplitRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const mapSplitInstance = useRef<any>(null);
  const markersRef = useRef<Marker[]>([]);

  // Initialize with all properties
  useEffect(() => {
    setFilteredProperties(properties);
  }, []);

  // Utility functions
  const getPropertyIcon = (type: string): string => {
    const icons: Record<string, string> = {
      house: '🏠',
      apartment: '🏢',
      condo: '🏙️',
      villa: '🏡'
    };
    return icons[type] || '🏠';
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const createPopupContent = (property: Property): string => {
    return `
      <div style="min-width: 250px;">
        <div style="width: 100%; height: 120px; background-size: cover; background-position: center; border-radius: 8px; margin-bottom: 0.8rem; background-image: url('${property.image}')"></div>
        <div style="font-weight: 600; color: #2c3e50; margin-bottom: 0.5rem; font-size: 1rem;">${property.title}</div>
        <div style="color: #27ae60; font-weight: 700; font-size: 1.2rem; margin-bottom: 0.5rem;">${formatPrice(property.price)}</div>
        <div style="display: flex; gap: 0.8rem; margin-bottom: 0.5rem; font-size: 0.85rem; color: #5d6d7e;">
          <span>🛏️ ${property.bedrooms}</span>
          <span>🚿 ${property.bathrooms}</span>
          <span>📐 ${property.area} sqft</span>
        </div>
        <div style="font-size: 0.85rem; color: #666; line-height: 1.4; margin-bottom: 0.8rem;">${property.description}</div>
      </div>
    `;
  };

  // Initialize maps
  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined' && !(window as any).L) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
        script.onload = () => {
          initializeMaps();
        };
        document.head.appendChild(script);
      } else if ((window as any).L) {
        initializeMaps();
      }
    };

    loadLeaflet();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
      if (mapSplitInstance.current) {
        mapSplitInstance.current.remove();
      }
    };
  }, []);

  const initializeMaps = () => {
    if (!(window as any).L) return;

    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = (window as any).L.map(mapRef.current).setView([39.8283, -98.5795], 4);
      (window as any).L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance.current);
    }

    if (mapSplitRef.current && !mapSplitInstance.current) {
      mapSplitInstance.current = (window as any).L.map(mapSplitRef.current).setView([39.8283, -98.5795], 4);
      (window as any).L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapSplitInstance.current);
    }

    setTimeout(() => {
      addMarkersToMaps();
    }, 100);
  };

  const addMarkersToMaps = () => {
    if (!(window as any).L || !mapInstance.current) return;

    markersRef.current.forEach(marker => {
      if (marker.main && mapInstance.current) {
        mapInstance.current.removeLayer(marker.main);
      }
      if (marker.split && mapSplitInstance.current) {
        mapSplitInstance.current.removeLayer(marker.split);
      }
    });
    markersRef.current = [];

    filteredProperties.forEach(property => {
      const popupContent = createPopupContent(property);
      
      const customIcon = (window as any).L.divIcon({
        html: `<div style="background: #667eea; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);">${getPropertyIcon(property.type)}</div>`,
        className: 'custom-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const mainMarker = (window as any).L.marker([property.lat, property.lng], { icon: customIcon })
        .addTo(mapInstance.current)
        .bindPopup(popupContent);

      let splitMarker = null;
      if (mapSplitInstance.current) {
        splitMarker = (window as any).L.marker([property.lat, property.lng], { icon: customIcon })
          .addTo(mapSplitInstance.current)
          .bindPopup(popupContent);
      }

      markersRef.current.push({ main: mainMarker, split: splitMarker, property: property });
    });

    if (filteredProperties.length > 0) {
      const group = new (window as any).L.featureGroup(markersRef.current.map(m => m.main));
      const bounds = group.getBounds();
      mapInstance.current.fitBounds(bounds, { padding: [20, 20] });
      if (mapSplitInstance.current) {
        mapSplitInstance.current.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  };

  useEffect(() => {
    if (mapInstance.current) {
      addMarkersToMaps();
    }
  }, [filteredProperties]);

  useEffect(() => {
    const filtered = properties.filter(property => {
      const matchesType = !filters.propertyType || property.type === filters.propertyType;
      const matchesPrice = !filters.priceRange || property.price <= parseInt(filters.priceRange);
      const matchesBedrooms = !filters.minBedrooms || property.bedrooms >= parseInt(filters.minBedrooms);

      return matchesType && matchesPrice && matchesBedrooms;
    });

    setFilteredProperties(filtered);
  }, [filters]);

  const handleFilterChange = (filterName: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleViewToggle = (viewType: 'map' | 'split' | 'list') => {
    setCurrentView(viewType);
    
    setTimeout(() => {
      if (viewType === 'map' && mapInstance.current) {
        mapInstance.current.invalidateSize();
      } else if (viewType === 'split' && mapSplitInstance.current) {
        mapSplitInstance.current.invalidateSize();
      }
    }, 100);
  };

  const handlePropertyHighlight = (propertyId: number) => {
    setHighlightedProperty(propertyId);
    
    const marker = markersRef.current.find(m => m.property.id === propertyId);
    if (marker && currentView === 'split' && mapSplitInstance.current) {
      mapSplitInstance.current.setView([marker.property.lat, marker.property.lng], 12);
      if (marker.split) {
        marker.split.openPopup();
      }
    }
  };

  const statistics = {
    total: filteredProperties.length,
    avgPrice: filteredProperties.length > 0 
      ? filteredProperties.reduce((sum, p) => sum + p.price, 0) / filteredProperties.length 
      : 0,
    minPrice: filteredProperties.length > 0 
      ? Math.min(...filteredProperties.map(p => p.price)) 
      : 0,
    maxPrice: filteredProperties.length > 0 
      ? Math.max(...filteredProperties.map(p => p.price)) 
      : 0
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
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Property Mapping</h1>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-md hover:bg-gray-100">
              <Bell className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Property Explorer</h1>
            <p className="text-sm sm:text-base text-gray-600">Browse properties on the map with interactive filters</p>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 sm:p-6 my-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-700 text-sm">Property Type</label>
                  <select 
                    className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={filters.propertyType}
                    onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="condo">Condo</option>
                    <option value="villa">Villa</option>
                  </select>
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-700 text-sm">Max Price</label>
                  <select 
                    className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  >
                    <option value="">Any Price</option>
                    <option value="500000">Under $500K</option>
                    <option value="800000">Under $800K</option>
                    <option value="1200000">Under $1.2M</option>
                    <option value="2000000">Under $2M</option>
                  </select>
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-700 text-sm">Min Bedrooms</label>
                  <select 
                    className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={filters.minBedrooms}
                    onChange={(e) => handleFilterChange('minBedrooms', e.target.value)}
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>
              </div>
              
              <div className="flex bg-gray-100 rounded-xl p-1 w-full sm:w-auto">
                <button 
                  className={`px-3 py-2 text-sm font-medium transition-all ${currentView === 'map' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`}
                  onClick={() => handleViewToggle('map')}
                >
                  Map
                </button>
                <button 
                  className={`px-3 py-2 text-sm font-medium transition-all ${currentView === 'split' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`}
                  onClick={() => handleViewToggle('split')}
                >
                  Split
                </button>
                <button 
                  className={`px-3 py-2 text-sm font-medium transition-all ${currentView === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`}
                  onClick={() => handleViewToggle('list')}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Map Only View */}
          {currentView === 'map' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div ref={mapRef} className="h-[500px] sm:h-[600px] w-full"></div>
            </div>
          )}

          {/* Split View */}
          {currentView === 'split' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div ref={mapSplitRef} className="h-[500px] sm:h-[600px] w-full"></div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 max-h-[500px] sm:max-h-[600px] overflow-y-auto">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Properties ({filteredProperties.length})</h3>
                </div>
                <div className="space-y-3">
                  {filteredProperties.map(property => (
                    <div 
                      key={property.id}
                      className={`flex gap-3 p-3 border rounded-lg cursor-pointer transition-all hover:border-indigo-600 hover:shadow-md ${
                        highlightedProperty === property.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                      }`}
                      onClick={() => handlePropertyHighlight(property.id)}
                    >
                      <div 
                        className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0"
                        style={{ backgroundImage: `url('${property.image}')` }}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{property.title}</h4>
                        <p className="text-green-600 font-bold text-sm sm:text-base">{formatPrice(property.price)}</p>
                        <p className="text-xs text-gray-500 truncate">📍 {property.location}</p>
                        <div className="flex gap-2 text-xs text-gray-600 mt-1">
                          <span>🛏️ {property.bedrooms}</span>
                          <span>🚿 {property.bathrooms}</span>
                          <span>📐 {property.area} sqft</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* List View */}
          {currentView === 'list' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Property Statistics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                  <p className="text-sm font-medium text-indigo-600 mb-1">Total Properties</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-sm font-medium text-green-600 mb-1">Average Price</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(statistics.avgPrice)}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm font-medium text-blue-600 mb-1">Lowest Price</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(statistics.minPrice)}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <p className="text-sm font-medium text-purple-600 mb-1">Highest Price</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(statistics.maxPrice)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Property List (for mobile) */}
          {currentView !== 'split' && (
            <div className="lg:hidden bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Properties ({filteredProperties.length})</h3>
              <div className="space-y-4">
                {filteredProperties.map(property => (
                  <div 
                    key={property.id}
                    className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div 
                      className="w-20 h-20 rounded-lg bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url('${property.image}')` }}
                    ></div>
                    <div>
                      <h4 className="font-medium text-gray-900">{property.title}</h4>
                      <p className="text-green-600 font-bold">{formatPrice(property.price)}</p>
                      <p className="text-sm text-gray-500">📍 {property.location}</p>
                      <div className="flex gap-3 text-sm text-gray-600 mt-1">
                        <span>🛏️ {property.bedrooms}</span>
                        <span>🚿 {property.bathrooms}</span>
                        <span>📐 {property.area} sqft</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyMapping;