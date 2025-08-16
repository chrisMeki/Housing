import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell } from 'lucide-react';
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
  neighborhood: string;
}

interface Marker {
  main: any;
  property: Property;
}

const PropertyMapping: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [highlightedProperty, setHighlightedProperty] = useState<number | null>(null);
  const [filters, setFilters] = useState<Filters>({
    propertyType: '',
    priceRange: '',
    minBedrooms: '',
    neighborhood: ''
  });
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  // Refs for map
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<Marker[]>([]);

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // For demo purposes, we'll use hardcoded Harare properties
        const data = [
          {
            id: 1,
            title: "Luxury Apartment in Borrowdale",
            location: "Borrowdale, Harare",
            lat: -17.7833,
            lng: 31.0667,
            price: 350000,
            type: "apartment",
            bedrooms: 3,
            bathrooms: 2,
            area: 180,
            image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
            description: "Modern apartment in Harare's most prestigious suburb"
          },
          {
            id: 2,
            title: "Family Home in Avondale",
            location: "Avondale, Harare",
            lat: -17.8000,
            lng: 31.0333,
            price: 275000,
            type: "house",
            bedrooms: 4,
            bathrooms: 3,
            area: 350,
            image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
            description: "Spacious family home in a quiet Avondale neighborhood"
          },
          {
            id: 3,
            title: "Townhouse in Mount Pleasant",
            location: "Mount Pleasant, Harare",
            lat: -17.7700,
            lng: 31.0500,
            price: 420000,
            type: "house",
            bedrooms: 3,
            bathrooms: 2.5,
            area: 280,
            image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
            description: "Elegant townhouse with modern finishes in Mount Pleasant"
          },
          {
            id: 4,
            title: "Executive Flat in CBD",
            location: "Harare CBD",
            lat: -17.8292,
            lng: 31.0522,
            price: 195000,
            type: "apartment",
            bedrooms: 2,
            bathrooms: 1,
            area: 120,
            image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
            description: "Convenient city center apartment with great amenities"
          }
        ];
        
        setProperties(data);
        setFilteredProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
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
          <span>📐 ${property.area} sqm</span>
        </div>
        <div style="font-size: 0.85rem; color: #666; line-height: 1.4; margin-bottom: 0.8rem;">${property.description}</div>
      </div>
    `;
  };

  // Load Leaflet
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadLeaflet = () => {
      if ((window as any).L) {
        setLeafletLoaded(true);
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
      link.onload = () => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
        script.onload = () => {
          setLeafletLoaded(true);
        };
        document.head.appendChild(script);
      };
      document.head.appendChild(link);
    };

    loadLeaflet();

    return () => {
      // Cleanup
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Initialize map when Leaflet is loaded
  useEffect(() => {
    if (!leafletLoaded) return;

    const initializeMap = () => {
      const L = (window as any).L;
      if (!L) return;

      if (mapRef.current && !mapInstance.current) {
        // Center on Harare
        mapInstance.current = L.map(mapRef.current).setView([-17.8252, 31.0335], 12);
        
        // Add base map layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance.current);

        // Add Harare landmarks
        const landmarks = [
          { name: "Harare CBD", lat: -17.8292, lng: 31.0522 },
          { name: "National Gallery", lat: -17.8258, lng: 31.0486 },
          { name: "Chapman Golf Club", lat: -17.8075, lng: 31.0675 },
          { name: "Harare Gardens", lat: -17.8300, lng: 31.0450 }
        ];

        landmarks.forEach(landmark => {
          L.marker([landmark.lat, landmark.lng])
            .addTo(mapInstance.current)
            .bindPopup(`<b>${landmark.name}</b>`);
        });
      }

      addMarkersToMap();
    };

    initializeMap();

    return () => {
      // Cleanup markers
      markersRef.current.forEach(marker => {
        if (marker.main && mapInstance.current) {
          mapInstance.current.removeLayer(marker.main);
        }
      });
      markersRef.current = [];
    };
  }, [leafletLoaded]);

  const addMarkersToMap = () => {
    const L = (window as any).L;
    if (!L || !mapInstance.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      if (marker.main && mapInstance.current) {
        mapInstance.current.removeLayer(marker.main);
      }
    });
    markersRef.current = [];

    filteredProperties.forEach(property => {
      const popupContent = createPopupContent(property);
      
      const customIcon = L.divIcon({
        html: `<div style="background: #667eea; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);">${getPropertyIcon(property.type)}</div>`,
        className: 'custom-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const mainMarker = L.marker([property.lat, property.lng], { icon: customIcon })
        .addTo(mapInstance.current)
        .bindPopup(popupContent);

      markersRef.current.push({ main: mainMarker, property: property });
    });

    if (filteredProperties.length > 0) {
      const group = new L.featureGroup(markersRef.current.map(m => m.main));
      const bounds = group.getBounds();
      mapInstance.current.fitBounds(bounds, { padding: [20, 20] });
    }
  };

  // Update markers when filtered properties change
  useEffect(() => {
    if (leafletLoaded && mapInstance.current) {
      addMarkersToMap();
    }
  }, [filteredProperties, leafletLoaded]);

  // Filter properties when filters change
  useEffect(() => {
    const filtered = properties.filter(property => {
      const matchesType = !filters.propertyType || property.type === filters.propertyType;
      const matchesPrice = !filters.priceRange || property.price <= parseInt(filters.priceRange);
      const matchesBedrooms = !filters.minBedrooms || property.bedrooms >= parseInt(filters.minBedrooms);
      const matchesNeighborhood = !filters.neighborhood || 
        property.location.toLowerCase().includes(filters.neighborhood.toLowerCase());

      return matchesType && matchesPrice && matchesBedrooms && matchesNeighborhood;
    });

    setFilteredProperties(filtered);
  }, [filters, properties]);

  const handleFilterChange = (filterName: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
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
          <h1 className="text-xl font-bold text-gray-800">Harare Property Map</h1>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-md hover:bg-gray-100">
              <Bell className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Harare Property Explorer</h1>
            <p className="text-sm sm:text-base text-gray-600">Browse properties in Harare with interactive filters</p>
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
                  <label className="font-semibold text-gray-700 text-sm">Max Price (USD)</label>
                  <select 
                    className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  >
                    <option value="">Any Price</option>
                    <option value="200000">Under $200K</option>
                    <option value="300000">Under $300K</option>
                    <option value="500000">Under $500K</option>
                    <option value="1000000">Under $1M</option>
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
                
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-700 text-sm">Neighborhood</label>
                  <select 
                    className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={filters.neighborhood}
                    onChange={(e) => handleFilterChange('neighborhood', e.target.value)}
                  >
                    <option value="">All Areas</option>
                    <option value="Borrowdale">Borrowdale</option>
                    <option value="Avondale">Avondale</option>
                    <option value="Mount Pleasant">Mount Pleasant</option>
                    <option value="Greendale">Greendale</option>
                    <option value="CBD">CBD</option>
                    <option value="Mbare">Mbare</option>
                    <option value="Highfield">Highfield</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Map View */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            {loading ? (
              <div className="h-[500px] sm:h-[600px] w-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <div ref={mapRef} className="h-[500px] sm:h-[600px] w-full"></div>
            )}
          </div>

          {/* Property List (for mobile) */}
          <div className="lg:hidden bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Properties ({filteredProperties.length})
              {filters.neighborhood && ` in ${filters.neighborhood}`}
            </h3>
            <div className="space-y-4">
              {filteredProperties.length === 0 ? (
                <p className="text-gray-500">No properties match your filters</p>
              ) : (
                filteredProperties.map(property => (
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
                        <span>🛏️ ${property.bedrooms}</span>
                        <span>🚿 ${property.bathrooms}</span>
                        <span>📐 ${property.area} sqm</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyMapping;