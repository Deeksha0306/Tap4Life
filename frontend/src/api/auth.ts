export const API_BASE_URL = "http://localhost:5000/api";

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // ADD THIS for session cookies
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const registerUser = async (name: string, email: string, password: string) => {
  const res = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // ADD THIS
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
};

export const getUser = async (userId: string) => {
  const res = await fetch(`${API_BASE_URL}/user/${userId}`, {
    credentials: "include", // ADD THIS
  });
  return res.json();
};

export const logoutUser = async () => {
  const res = await fetch(`${API_BASE_URL}/logout`, {
    method: "POST",
    credentials: "include", // ADD THIS
  });
  localStorage.removeItem("user_id");
  return res.json();
};