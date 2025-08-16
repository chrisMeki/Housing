import React, { useState } from 'react';
import { LogOut, Shield, Menu } from 'lucide-react';
import Sidebar from "../components/sidebar";

const LogoutPage = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogoutClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    
    // Simulate logout API call
    setTimeout(() => {
      setIsLoggingOut(false);
      setLoggedOut(true);
      
      // In a real app, you would:
      // - Clear auth tokens from memory/cookies
      // - Clear user data from state management
      // - Redirect to login page
      console.log('User logged out successfully');
    }, 1500);
  };

  const handleCancelLogout = () => {
    setShowConfirmation(false);
  };

  const handleBackToApp = () => {
    // In a real app, this would navigate back to the main application
    setLoggedOut(false);
    setShowConfirmation(false);
    console.log('Navigating back to app');
  };

  if (loggedOut) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Successfully Logged Out
          </h1>
          <p className="text-gray-600 mb-6">
            You have been securely logged out of your account. Thank you for using our service!
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/login'}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Sign In Again
            </button>
            <button
              onClick={handleBackToApp}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Back to Home
            </button>
          </div>
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
        <div className="lg:hidden sticky top-0 z-40 bg-white shadow-sm border-b">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-blue-600 text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Logout</h1>
          </div>
        </div>

        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
            {!showConfirmation ? (
              <>
                {/* Logout Section */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LogOut className="w-8 h-8 text-red-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Ready to Log Out?
                  </h1>
                  <p className="text-gray-600 mb-8">
                    Are you sure you want to sign out of your account?
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={handleLogoutClick}
                      className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-5 h-5" />
                      Log Out
                    </button>
                    <button
                      onClick={handleBackToApp}
                      className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel & Stay Signed In
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Confirmation Dialog */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LogOut className="w-8 h-8 text-orange-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Confirm Logout
                  </h1>
                  <p className="text-gray-600 mb-8">
                    This will end your current session.
                  </p>

                  {isLoggingOut ? (
                    <div className="py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Logging you out...</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <button
                        onClick={handleConfirmLogout}
                        className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                      >
                        Yes, Log Me Out
                      </button>
                      <button
                        onClick={handleCancelLogout}
                        className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;