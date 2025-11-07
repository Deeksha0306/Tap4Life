// src/pages/register.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Lock, Mail, User, AlertCircle } from "lucide-react";
import { registerUser, loginUser } from "../api/auth";

interface RegisterProps {
  setIsLoggedIn: (value: boolean) => void;
}

export default function Register({ setIsLoggedIn }: RegisterProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === "password") {
      let strength = 0;
      if (value.length >= 8) strength++;
      if (/[A-Z]/.test(value)) strength++;
      if (/[0-9]/.test(value)) strength++;
      if (/[^A-Za-z0-9]/.test(value)) strength++;
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async () => {
    setError("");
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Registering user:", { name: formData.name, email: formData.email });
      const res = await registerUser(formData.name, formData.email, formData.password);
      console.log("Registration response:", res);
      
      if (res.success) {
        // AUTO-LOGIN after successful registration
        console.log("Registration successful, attempting auto-login...");
        const loginRes = await loginUser(formData.email, formData.password);
        console.log("Login response:", loginRes);
        
        if (loginRes.success) {
          localStorage.setItem("user_id", loginRes.user_id);
          setIsLoggedIn(true);
          navigate("/dashboard");
        } else {
          // If auto-login fails, redirect to login
          navigate("/login");
        }
      } else {
        setError(res.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Failed to connect to server. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-200";
    if (passwordStrength === 1) return "bg-red-400";
    if (passwordStrength === 2) return "bg-yellow-400";
    if (passwordStrength === 3) return "bg-blue-400";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength === 1) return "Weak";
    if (passwordStrength === 2) return "Fair";
    if (passwordStrength === 3) return "Good";
    return "Strong";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-3xl shadow-lg mb-4 transform hover:scale-105 transition-transform">
            <Heart className="w-10 h-10 text-white" fill="white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Tap4Life</h1>
          <p className="text-lg text-gray-600">Create Your Emergency Profile</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign Up</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-400 focus:outline-none transition-colors"
                  placeholder="Name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-400 focus:outline-none transition-colors"
                  placeholder="Email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-400 focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 4) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-600">{getStrengthText()}</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-400 focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-lg font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button 
                onClick={() => navigate("/login")}
                className="text-blue-500 font-semibold hover:text-blue-600 transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        <div className="mt-6 bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-4">
          <p className="text-sm text-gray-600 text-center mb-2">
            By signing up, you agree to our
          </p>
          <div className="flex items-center justify-center gap-3 text-xs text-blue-600 font-semibold">
            <button className="hover:underline">Terms of Service</button>
            <span className="text-gray-400">•</span>
            <button className="hover:underline">Privacy Policy</button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          🔒 Your health data is secure and encrypted
        </p>
      </div>
    </div>
  );
}