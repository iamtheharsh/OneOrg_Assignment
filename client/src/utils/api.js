// src/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

// Optional: auto logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
