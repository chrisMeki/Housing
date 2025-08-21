import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell } from 'lucide-react';
import Sidebar from '../components/sidebar';
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

interface Marker {
  main: any;
  property: Property;
}

const PropertyMapping: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<Marker[]>([]);

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await PropertyService.getAllProperties();
        if (response && response.data) {
          setProperties(response.data);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

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

  // Load Leaflet + Geocoder
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadLeaflet = () => {
      if ((window as any).L) {
        setLeafletLoaded(true);
        return;
      }

      // Load Leaflet CSS + JS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
      script.onload = () => {
        // Load Geocoder CSS + JS
        const geocoderLink = document.createElement('link');
        geocoderLink.rel = 'stylesheet';
        geocoderLink.href = 'https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css';
        document.head.appendChild(geocoderLink);

        const geocoderScript = document.createElement('script');
        geocoderScript.src = 'https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js';
        geocoderScript.onload = () => {
          setLeafletLoaded(true);
        };
        document.head.appendChild(geocoderScript);
      };
      document.head.appendChild(script);
    };

    loadLeaflet();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Initialize map & markers
  useEffect(() => {
    if (!leafletLoaded || properties.length === 0) return;

    const L = (window as any).L;
    if (!L) return;

    if (mapRef.current && !mapInstance.current) {
      // Center on Harare
      mapInstance.current = L.map(mapRef.current).setView([-17.8252, 31.0335], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance.current);

      // Add search control
      if ((L.Control as any).geocoder) {
        const geocoder = (L.Control as any).geocoder({
          defaultMarkGeocode: true
        })
          .on('markgeocode', (e: any) => {
            mapInstance.current.fitBounds(e.geocode.bbox);
          })
          .addTo(mapInstance.current);
      }
    }

    // Add property markers
    addMarkersToMap();
  }, [leafletLoaded, properties]);

  const addMarkersToMap = () => {
    const L = (window as any).L;
    if (!L || !mapInstance.current) return;

    // Clear old markers
    markersRef.current.forEach(marker => {
      if (marker.main && mapInstance.current) {
        mapInstance.current.removeLayer(marker.main);
      }
    });
    markersRef.current = [];

    properties.forEach(property => {
      if (!property.lat || !property.lng) return; // skip if no coordinates

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

      markersRef.current.push({ main: mainMarker, property });
    });

    // If we have properties, fit the map to show all markers
    if (properties.length > 0 && properties.some(p => p.lat && p.lng)) {
      const validProperties = properties.filter(p => p.lat && p.lng);
      if (validProperties.length > 0) {
        const group = new L.featureGroup(
          validProperties.map(p => L.marker([p.lat, p.lng]))
        );
        mapInstance.current.fitBounds(group.getBounds().pad(0.1));
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:ml-72 flex flex-col">
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md hover:bg-gray-100">
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Harare Property Map</h1>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-md hover:bg-gray-100">
              <Bell className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex-1">
          {loading ? (
            <div className="h-full w-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div ref={mapRef} className="h-full w-full"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyMapping;
