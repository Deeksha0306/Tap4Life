import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Shield, Phone, Users, Clock, MapPin, ChevronRight } from "lucide-react";

export default function Welcome() {
  const [activeFeature, setActiveFeature] = useState(0);
  const navigate = useNavigate();

  const features = [
    {
      icon: Phone,
      title: "Emergency SOS",
      description: "One-tap emergency calling with location sharing",
      color: "from-red-400 to-red-600"
    },
    {
      icon: Heart,
      title: "Medical Card",
      description: "Store vital health information accessible anytime",
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: Users,
      title: "Emergency Contacts",
      description: "Quick access to your trusted emergency contacts",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: MapPin,
      title: "Location Sharing",
      description: "Share your real-time location during emergencies",
      color: "from-purple-400 to-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Logo and Title */}
          <div className="text-center mb-12 pt-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-3xl shadow-2xl mb-6 transform hover:scale-110 transition-transform">
              <Heart className="w-12 h-12 text-white" fill="white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
              SafePulse
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-2">
              Your Emergency Health Companion
            </p>
            <p className="text-base text-gray-500 max-w-2xl mx-auto">
              Access critical health information from your lock screen. Be prepared for any emergency, anytime, anywhere.
            </p>
          </div>

          {/* Hero Image/Animation */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12 transform hover:scale-[1.02] transition-all">
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center animate-pulse">
                  <Phone className="w-16 h-16 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Emergency Ready
                </h2>
                <p className="text-gray-600 text-lg mb-4">
                  Help is just one tap away
                </p>
                <div className="flex items-center gap-2 text-green-600 font-semibold">
                  <Clock className="w-5 h-5" />
                  <span>24/7 Protection</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">
              Why Choose SafePulse?
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveFeature(idx)}
                    className={`p-6 rounded-2xl text-left transition-all transform hover:scale-[1.02] ${
                      activeFeature === idx
                        ? "bg-white shadow-xl border-2 border-blue-400"
                        : "bg-white shadow-md hover:shadow-lg"
                    }`}
                  >
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <p className="text-3xl font-bold text-blue-500 mb-1">100%</p>
              <p className="text-sm text-gray-600">Secure</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <p className="text-3xl font-bold text-green-500 mb-1">24/7</p>
              <p className="text-sm text-gray-600">Available</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <p className="text-3xl font-bold text-purple-500 mb-1">Fast</p>
              <p className="text-sm text-gray-600">Response</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4">
            <button 
              onClick={() => navigate("/register")}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xl font-bold py-5 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              Get Started
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => navigate("/register")}
                className="bg-white text-blue-600 text-lg font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all border-2 border-blue-200"
              >
                Sign Up
              </button>
              <button 
                onClick={() => navigate("/login")}
                className="bg-white text-gray-700 text-lg font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
              >
                Login
              </button>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white bg-opacity-70 px-6 py-3 rounded-full">
              <Shield className="w-5 h-5 text-green-500" />
              <p className="text-sm text-gray-600">
                <span className="font-semibold">256-bit encryption</span> • Your data is safe and private
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-sm text-gray-500">
            <p>By continuing, you agree to our</p>
            <div className="flex items-center justify-center gap-3 mt-2">
              <button className="text-blue-600 hover:underline font-semibold">Terms of Service</button>
              <span>•</span>
              <button className="text-blue-600 hover:underline font-semibold">Privacy Policy</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}