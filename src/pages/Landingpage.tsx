import React, { useState, useEffect } from 'react';
import { MapPin, Home, Users, Shield, ArrowRight, Menu, X } from 'lucide-react';

export default function HousingLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-black/20 backdrop-blur-md' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-teal-400" />
              <span className="text-2xl font-bold text-white">HouseMap</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
              <a href="/login" className="text-gray-300 hover:text-white transition-colors">Login</a>
              <a href="/signup" className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105">
                Sign Up
              </a>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-black/90 backdrop-blur-md rounded-lg mt-2 p-4">
              <div className="flex flex-col space-y-3">
                <a href="#features" className="text-gray-300 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Features</a>
                <a href="#about" className="text-gray-300 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>About</a>
                <a href="/login" className="text-gray-300 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Login</a>
                <a href="/signup" className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-full text-center transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Map Your
              <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent"> Future</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Discover, register, and manage housing with our intelligent mapping platform. 
              Your perfect home is just a click away.
            </p>
            {/* Housing Images Gallery */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12">
              <div className="group relative overflow-hidden rounded-2xl aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=300&fit=crop&crop=center" 
                  alt="Modern House" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="group relative overflow-hidden rounded-2xl aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=300&h=300&fit=crop&crop=center" 
                  alt="Apartment Building" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="group relative overflow-hidden rounded-2xl aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1449844908441-8829872d2607?w=300&h=300&fit=crop&crop=center" 
                  alt="Luxury Villa" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="group relative overflow-hidden rounded-2xl aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1484154218962-a197022b5858?w=300&h=300&fit=crop&crop=center" 
                  alt="Cozy Home" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
            Why Choose HouseMap?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <MapPin className="h-12 w-12 text-teal-400" />,
                title: "Smart Mapping",
                description: "Advanced geolocation technology to find and register properties with precision mapping capabilities."
              },
              {
                icon: <Home className="h-12 w-12 text-emerald-400" />,
                title: "Easy Registration",
                description: "Streamlined housing registration process with intuitive forms and instant verification."
              },
              {
                icon: <Shield className="h-12 w-12 text-blue-400" />,
                title: "Secure Platform",
                description: "Bank-grade security ensuring your personal information and property data stays protected."
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-white/10"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
            About HouseMap
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-teal-400 mb-6">Our Mission</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                HouseMap was founded with a simple goal: to revolutionize how people find and register housing. 
                We believe everyone deserves access to accurate, up-to-date housing information with the power 
                of modern mapping technology.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Our platform combines geolocation services with a user-friendly interface to make housing 
                registration seamless and efficient for both individuals and organizations.
              </p>
            </div>
            <div className="bg-gradient-to-br from-teal-500/20 to-emerald-600/20 p-8 rounded-2xl border border-white/10">
              <h3 className="text-3xl font-bold text-white mb-6">Our Team</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                We're a diverse team of mapping experts, software engineers, and housing professionals 
                dedicated to creating the best housing registration experience.
              </p>
              <div className="flex space-x-4">
                <div className="bg-teal-600/30 px-4 py-2 rounded-full text-white">Experts</div>
                <div className="bg-emerald-600/30 px-4 py-2 rounded-full text-white">Innovators</div>
                <div className="bg-cyan-600/30 px-4 py-2 rounded-full text-white">Problem Solvers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-teal-600/20 to-emerald-600/20 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust HouseMap for their housing registration and mapping needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/signup" className="bg-white text-teal-900 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105">
                Create Account
              </a>
              <a href="/login" className="text-white border-2 border-white/30 hover:border-white hover:bg-white/10 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300">
                Sign In
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-sm py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <MapPin className="h-8 w-8 text-teal-400" />
            <span className="text-2xl font-bold text-white">HouseMap</span>
          </div>
          <p className="text-gray-400 mb-4">
            Making housing registration simple, secure, and accessible for everyone.
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>

      <style >{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}