// src/pages/login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Lock, Mail, AlertCircle } from "lucide-react";
import { loginUser } from "../api/auth";

interface LoginProps {
  setIsLoggedIn: (value: boolean) => void;
}

export default function Login({ setIsLoggedIn }: LoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await loginUser(email, password);
      console.log("Login response:", res); // DEBUG
      
      if (res.success) {
        localStorage.setItem("user_id", res.user_id);
        setIsLoggedIn(true);
        navigate("/dashboard");
      } else {
        setError(res.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to connect to server. Please check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div 
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-3xl shadow-lg mb-4 transform hover:scale-105 transition-transform cursor-pointer"
          >
            <Heart className="w-10 h-10 text-white" fill="white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Tap4Life</h1>
          <p className="text-lg text-gray-600">Your Emergency Health Companion</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Welcome Back</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-400 focus:outline-none transition-colors"
                  placeholder="Email"
                  required
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-400 focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
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
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-lg font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button 
                type="button"
                onClick={() => navigate("/register")}
                className="text-blue-500 font-semibold hover:text-blue-600 transition-colors"
              >
                Create Account
              </button>
            </p>
          </div>

          <div className="text-center mt-4">
            <button 
              type="button"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Forgot your password?
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          🔒 Your health data is secure and encrypted
        </p>
      </div>
    </div>
  );
}