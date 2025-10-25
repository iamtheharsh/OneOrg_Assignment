// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8000", // ✅ backend port
// });
import axios from "axios";

const api = axios.create({
  baseURL: "https://oneorgassignment.vercel.app", // ✅ backend deployed URL
  withCredentials: true, // ✅ allow cookies or token-based auth
});

export default api;
