// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8000", // ✅ backend port
// });
import axios from "axios";

// const api = axios.create({
//   baseURL: "https://oneorgassignment.vercel.app", // ✅ backend deployed URL
//   withCredentials: true, // ✅ allow cookies or token-based auth
// });

const api = axios.create({
  baseURL: "https://oneorg-assignment-backend.onrender.com", // your new Render URL
  withCredentials: true,
});

export default api;
