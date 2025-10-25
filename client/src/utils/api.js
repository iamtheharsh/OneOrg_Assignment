import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8000", // ✅ backend port
// });
const api = axios.create({
  baseURL: "https://oneorgassignment.vercel.app", // ✅ your deployed backend URL
});

export default api;
