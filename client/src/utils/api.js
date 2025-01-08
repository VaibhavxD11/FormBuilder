import axios from "axios";

const API = axios.create({
  baseURL: "https://formbuilder-backend-8hew.onrender.com/api", // Replace with your backend URL
});

// Intercept request to add Authorization header if token exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
