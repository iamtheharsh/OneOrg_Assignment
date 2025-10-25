import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import AuthContext from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", form);
      login(data);
      setMsg("✅ Login successful!");
      setTimeout(() => navigate("/feed"), 800); // redirect after 0.8s
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.message || "Login failed"));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-eggplant">
      <h1 className="text-3xl mb-4 font-bold">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="p-2 rounded"
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          onChange={handleChange}
          className="p-2 rounded"
        />
        <button className="bg-eggplant text-white p-2 rounded hover:bg-dimgray">
          Login
        </button>
      </form>
      <p className="mt-3">{msg}</p>

      {/* 👇 Added register link */}
      <div className="mt-4 flex justify-center">
        <p className="text-sm text-dimgray">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-eggplant font-semibold hover:underline"
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
