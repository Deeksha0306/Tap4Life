// src/pages/dashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Phone, User, Droplet, AlertTriangle, Edit, LogOut, Activity, Clock, MapPin, X, Save } from "lucide-react";
import { getUser, logoutUser } from "../api/auth";

interface UserType {
  id: number;
  name: string;
  email: string;
  bloodGroup?: string;
  allergies?: string;
  medicalConditions?: string;
  age?: number;
}

interface EmergencyContact {
  id?: number;
  name: string;
  relation: string;
  phone: string;
}

interface DashboardProps {
  setIsLoggedIn: (value: boolean) => void;
}

export default function Dashboard({ setIsLoggedIn }: DashboardProps) {
  const [user, setUser] = useState<UserType | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [sosPressed, setSosPressed] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [loading, setLoading] = useState(true);

  const [editedUser, setEditedUser] = useState({
    bloodGroup: "",
    allergies: "",
    medicalConditions: "",
    age: ""
  });

  const [newContact, setNewContact] = useState({
    name: "",
    relation: "",
    phone: ""
  });

  const navigate = useNavigate();

  // Fetch user and contacts on load
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        navigate("/login");
        return;
      }

      try {
        const res = await getUser(userId);
        if (res.success) {
          setUser(res.user);
          setEditedUser({
            bloodGroup: res.user.bloodGroup || "",
            allergies: res.user.allergies || "",
            medicalConditions: res.user.medicalConditions || "",
            age: res.user.age ? res.user.age.toString() : ""
          });
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/login");
      }

      // Fetch emergency contacts
      await fetchEmergencyContacts();
      setLoading(false);
    };

    fetchUserData();
  }, [navigate]);

  // Fetch contacts from DB
  const fetchEmergencyContacts = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    try {
      const res = await fetch(`http://localhost:5000/api/emergency-contacts/${userId}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success && data.contacts) {
        setEmergencyContacts(data.contacts);
      }
    } catch (error) {
      console.error("Error fetching emergency contacts:", error);
    }
  };

  const handleSOSPress = () => {
    setSosPressed(true);

    setTimeout(() => {
      alert("🚨 Emergency services contacted!\n📍 Location shared with emergency contacts");
      setSosPressed(false);
    }, 2000);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("user_id");
      setIsLoggedIn(false);
      navigate("/login");
    }
  };

  const handleSaveMedicalInfo = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/medical-info/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editedUser)
      });

      const data = await response.json();
      if (data.success) {
        setUser(prev => prev ? { ...prev, ...editedUser, age: parseInt(editedUser.age) || undefined } : null);
        setEditMode(false);
        alert("Medical information updated successfully!");
      }
    } catch (error) {
      console.error("Error updating medical info:", error);
      alert("Failed to update medical information");
    }
  };

  const handleAddContact = async () => {
  const userId = localStorage.getItem("user_id");
  
  // Check if max contacts reached
  if (emergencyContacts.length >= 5) {
    alert("You can add a maximum of 5 emergency contacts only.");
    return;
  }

  if (!userId || !newContact.name || !newContact.relation || !newContact.phone) {
    alert("Please fill all fields");
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/emergency-contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ...newContact, user_id: userId })
    });

    const data = await response.json();
    if (data.success) {
      setEmergencyContacts([...emergencyContacts, newContact]);
      setNewContact({ name: "", relation: "", phone: "" });
      setShowAddContact(false);
      alert("Emergency contact added!");
    }
  } catch (error) {
    console.error("Error adding contact:", error);
    alert("Failed to add contact");
  }
};


  const handleCallContact = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your health profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Tap4Life</h1>
              <p className="text-sm text-gray-600">Welcome, {user.name}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-3 rounded-2xl bg-white shadow-md hover:shadow-lg transition-all hover:bg-red-50 group"
          >
            <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-500" />
          </button>
        </div>

        {/* SOS Button */}
        <div className="mb-6">
          <button
            onClick={handleSOSPress}
            disabled={sosPressed}
            className={`w-full p-8 rounded-3xl shadow-2xl transform transition-all ${
              sosPressed 
                ? "bg-red-600 scale-95" 
                : "bg-gradient-to-br from-red-500 to-red-600 hover:scale-[1.02] hover:shadow-3xl"
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`w-20 h-20 bg-white rounded-full flex items-center justify-center ${sosPressed ? "animate-pulse" : ""}`}>
                <Phone className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-3xl font-bold text-white">
                {sosPressed ? "CALLING Emergency Contacts.." : "EMERGENCY SOS"}
              </h2>
              <p className="text-white text-lg">
                {sosPressed ? "Help is on the way" : "Press to call emergency services"}
              </p>
            </div>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-md text-center">
            <Activity className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-xs text-gray-600 mb-1">Heart Rate</p>
            <p className="text-xl font-bold text-gray-800">72 bpm</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md text-center">
            <Droplet className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-xs text-gray-600 mb-1">Blood Type</p>
            <p className="text-xl font-bold text-gray-800">{user.bloodGroup || "N/A"}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md text-center">
            <Clock className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-xs text-gray-600 mb-1">Status</p>
            <p className="text-xl font-bold text-green-600">Active</p>
          </div>
        </div>

        {/* Medical Card */}
        <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <User className="w-6 h-6 text-blue-500" />
              Medical Card
            </h3>
            {!editMode ? (
              <button onClick={() => setEditMode(true)} className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
                <Edit className="w-5 h-5 text-blue-500" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={handleSaveMedicalInfo} className="p-2 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
                  <Save className="w-5 h-5 text-green-500" />
                </button>
                <button onClick={() => setEditMode(false)} className="p-2 rounded-xl bg-red-50 hover:bg-red-100 transition-colors">
                  <X className="w-5 h-5 text-red-500" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl">
              <p className="text-sm font-semibold text-gray-600 mb-1">Full Name</p>
              <p className="text-lg font-bold text-gray-800">{user.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-red-50 rounded-2xl">
                <p className="text-sm font-semibold text-gray-600 mb-1">Blood Group</p>
                {editMode ? (
                  <input
                    type="text"
                    value={editedUser.bloodGroup}
                    onChange={(e) => setEditedUser({...editedUser, bloodGroup: e.target.value})}
                    className="w-full text-2xl font-bold text-red-600 bg-transparent border-b-2 border-red-300 focus:outline-none focus:border-red-500"
                    placeholder="O+"
                  />
                ) : (
                  <p className="text-2xl font-bold text-red-600">{user.bloodGroup || "Not set"}</p>
                )}
              </div>
              <div className="p-4 bg-purple-50 rounded-2xl">
                <p className="text-sm font-semibold text-gray-600 mb-1">Age</p>
                {editMode ? (
                  <input
                    type="number"
                    value={editedUser.age}
                    onChange={(e) => setEditedUser({...editedUser, age: e.target.value})}
                    className="w-full text-2xl font-bold text-purple-600 bg-transparent border-b-2 border-purple-300 focus:outline-none focus:border-purple-500"
                    placeholder="32"
                  />
                ) : (
                  <p className="text-2xl font-bold text-purple-600">{user.age ? `${user.age} years` : "Not set"}</p>
                )}
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-semibold text-gray-700">Allergies</p>
              </div>
              {editMode ? (
                <textarea
                  value={editedUser.allergies}
                  onChange={(e) => setEditedUser({...editedUser, allergies: e.target.value})}
                  className="w-full ml-7 bg-transparent border-b-2 border-yellow-300 focus:outline-none focus:border-yellow-500 resize-none"
                  placeholder="List your allergies..."
                  rows={2}
                />
              ) : (
                <p className="text-base text-gray-800 ml-7">{user.allergies || "None listed"}</p>
              )}
            </div>

            <div className="p-4 bg-orange-50 rounded-2xl">
              <p className="text-sm font-semibold text-gray-600 mb-2">Medical Conditions</p>
              {editMode ? (
                <textarea
                  value={editedUser.medicalConditions}
                  onChange={(e) => setEditedUser({...editedUser, medicalConditions: e.target.value})}
                  className="w-full bg-transparent border-b-2 border-orange-300 focus:outline-none focus:border-orange-500 resize-none"
                  placeholder="List medical conditions..."
                  rows={2}
                />
              ) : (
                <p className="text-base text-gray-800">{user.medicalConditions || "None listed"}</p>
              )}
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
            <Phone className="w-6 h-6 text-green-500" />
            Emergency Contacts
          </h3>

          <div className="space-y-3">
            {emergencyContacts.map((contact, idx) => (
              <div key={idx} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-800 text-lg">{contact.name}</p>
                  <p className="text-sm text-gray-600">{contact.relation}</p>
                </div>
                <button 
                  onClick={() => handleCallContact(contact.phone)}
                  className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Call
                </button>
              </div>
            ))}
          </div>

          {!showAddContact ? (
            <button 
              onClick={() => setShowAddContact(true)}
              className="w-full mt-4 p-3 border-2 border-dashed border-gray-300 rounded-2xl text-gray-600 hover:border-blue-400 hover:text-blue-500 transition-colors font-semibold"
            >
              + Add Emergency Contact
            </button>
          ) : (
            <div className="mt-4 p-4 bg-gray-50 rounded-2xl space-y-3">
              <input
                type="text"
                value={newContact.name}
                onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                placeholder="Contact Name"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
              />
              <input
                type="text"
                value={newContact.relation}
                onChange={(e) => setNewContact({...newContact, relation: e.target.value})}
                placeholder="Relation (e.g., Wife, Doctor)"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
              />
              <input
                type="tel"
                value={newContact.phone}
                onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                placeholder="Phone Number"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
              />
              <div className="flex gap-2">
                <button 
                  onClick={handleAddContact}
                  className="flex-1 p-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
                >
                  Save Contact
                </button>
                <button 
                  onClick={() => {
                    setShowAddContact(false);
                    setNewContact({ name: "", relation: "", phone: "" });
                  }}
                  className="flex-1 p-3 bg-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Location Sharing */}
        <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
            <MapPin className="w-6 h-6 text-blue-500" />
            Shared Location
          </h3>
          <p className="text-gray-600">Your current location is automatically shared with your emergency contacts when SOS is pressed.</p>
        </div>

      </div>
    </div>
  );
}
