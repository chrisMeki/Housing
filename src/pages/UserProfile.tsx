import React, { useState, useEffect } from 'react';
import { User, MapPin, Home, Calendar, Phone, Mail, Edit3, Camera, Settings, FileText, Shield, Menu } from 'lucide-react';
import Sidebar from '../components/sidebar';
import UserService from '../services/login_Service';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    id: "",
    registrationDate: "",
    status: "Unverified"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const properties = [
    {
      id: "PROP-001",
      address: "1247 Maple Street, Downtown District",
      type: "Residential - Single Family",
      size: "2,400 sq ft",
      bedrooms: 3,
      bathrooms: 2,
      registrationStatus: "Active",
      lastUpdated: "2024-07-15",
      coordinates: "40.7128° N, 74.0060° W"
    },
    {
      id: "PROP-002",
      address: "892 Oak Avenue, Riverside Area", 
      type: "Residential - Condo",
      size: "1,200 sq ft",
      bedrooms: 2,
      bathrooms: 1,
      registrationStatus: "Pending Review",
      lastUpdated: "2024-08-01",
      coordinates: "40.7589° N, 73.9851° W"
    }
  ];

  const documents = [
    { name: "Property Deed - Maple St", type: "PDF", date: "2024-03-15", status: "Verified" },
    { name: "Insurance Certificate", type: "PDF", date: "2024-07-20", status: "Verified" },
    { name: "Utility Connection Form", type: "PDF", date: "2024-08-01", status: "Pending" }
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Try to get user data from localStorage (set during signup/login)
        const storedUserData = localStorage.getItem('userData');
        
        if (storedUserData) {
          // Parse the stored user data
          const user = JSON.parse(storedUserData);
          setUserData({
            name: user.fullname || user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            id: user._id || user.id || "",
            registrationDate: new Date(user.createdAt || user.registrationDate || Date.now()).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            status: user.verified ? "Verified" : "Unverified"
          });
        } else {
          // If no stored data, try to get user by ID
          const userId = localStorage.getItem('userId');
          if (userId) {
            const response = await UserService.getUserById(userId);
            setUserData({
              name: response.data.fullname || response.data.name || "",
              email: response.data.email || "",
              phone: response.data.phone || "",
              id: response.data._id || response.data.id || "",
              registrationDate: new Date(response.data.createdAt || response.data.registrationDate || Date.now()).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }),
              status: response.data.verified ? "Verified" : "Unverified"
            });
          }
        }
      } catch (err: any) {
        setError("Failed to load user data");
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    try {
      const userId = localStorage.getItem('userId') || userData.id;
      if (userId) {
        const updatedData = {
          fullname: userData.name,
          email: userData.email,
          phone: userData.phone
        };
        
        await UserService.updateUser(userId, updatedData);
        
        // Update localStorage with new data
        const updatedUser = {
          fullname: userData.name,
          email: userData.email,
          phone: userData.phone,
          _id: userId,
          createdAt: new Date().toISOString(), // This would ideally come from the server
          verified: userData.status === "Verified"
        };
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        
        setIsEditing(false);
        // Optionally show a success message
      }
    } catch (err: any) {
      setError("Failed to update user data");
      console.error("Error updating user data:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
        <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="text-blue-600 p-2 rounded-md hover:bg-blue-50"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">User Profile</h1>
          <div className="w-6"></div> {/* Spacer for alignment */}
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Profile Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                {/* Profile Avatar */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {userData.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
                      <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mt-4">{userData.name}</h3>
                  <p className="text-sm text-gray-600">ID: {userData.id}</p>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    userData.status === "Verified" ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  } mt-2`}>
                    <Shield className="w-4 h-4 mr-1" />
                    {userData.status}
                  </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                  {[
                    { id: 'profile', label: 'Profile Info', icon: User },
                    { id: 'properties', label: 'Properties', icon: Home },
                    { id: 'documents', label: 'Documents', icon: FileText }
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                        activeTab === id
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'profile' && (
                <div className="bg-white rounded-xl shadow-lg">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                      <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={userData.name}
                            onChange={(e) => setUserData({...userData, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{userData.name}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        {isEditing ? (
                          <input 
                            type="email" 
                            value={userData.email}
                            onChange={(e) => setUserData({...userData, email: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="flex items-center py-2">
                            <Mail className="w-4 h-4 text-gray-500 mr-2" />
                            <p className="text-gray-900">{userData.email}</p>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        {isEditing ? (
                          <input 
                            type="tel" 
                            value={userData.phone}
                            onChange={(e) => setUserData({...userData, phone: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="flex items-center py-2">
                            <Phone className="w-4 h-4 text-gray-500 mr-2" />
                            <p className="text-gray-900">{userData.phone}</p>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Registration Date</label>
                        <div className="flex items-center py-2">
                          <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                          <p className="text-gray-900">{userData.registrationDate}</p>
                        </div>
                      </div>
                    </div>
                    {isEditing && (
                      <div className="mt-6 flex space-x-4">
                        <button 
                          onClick={handleSaveChanges}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                          Save Changes
                        </button>
                        <button 
                          onClick={() => setIsEditing(false)}
                          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'properties' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Registered Properties</h2>
                    <div className="grid gap-6">
                      {properties.map((property) => (
                        <div key={property.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{property.address}</h3>
                              <p className="text-gray-600">{property.type}</p>
                            </div>
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              property.registrationStatus === 'Active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {property.registrationStatus}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Size:</span>
                              <p className="font-medium">{property.size}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Bedrooms:</span>
                              <p className="font-medium">{property.bedrooms}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Bathrooms:</span>
                              <p className="font-medium">{property.bathrooms}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Last Updated:</span>
                              <p className="font-medium">{property.lastUpdated}</p>
                            </div>
                          </div>
                          <div className="mt-4 flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-1" />
                            {property.coordinates}
                          </div>
                          <div className="mt-4 flex space-x-3">
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View Details</button>
                            <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">Edit</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Documents & Certificates</h2>
                  <div className="space-y-4">
                    {documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                          <FileText className="w-8 h-8 text-blue-500 mr-4" />
                          <div>
                            <h4 className="font-medium text-gray-900">{doc.name}</h4>
                            <p className="text-sm text-gray-600">Uploaded: {doc.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            doc.status === 'Verified' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {doc.status}
                          </div>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Download</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                      Upload New Document
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}