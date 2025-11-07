import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/welcome";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user_id"));

  return (
    <Router>
      <Routes>
        {/* Welcome page as default */}
        <Route path="/" element={<Welcome />} />
        
        <Route 
          path="/welcome" 
          element={<Welcome />} 
        />
      

        <Route 
          path="/register" 
          element={<Register setIsLoggedIn={setIsLoggedIn} />} 
        />
        
        <Route 
          path="/login" 
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login setIsLoggedIn={setIsLoggedIn} />} 
        />
        
        <Route 
          path="/dashboard" 
          element={isLoggedIn ? <Dashboard setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;