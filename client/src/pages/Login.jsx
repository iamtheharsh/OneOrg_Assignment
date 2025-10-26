import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import AuthContext from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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

        {/* ✅ Login button above bottom text */}
       <button
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 
                    bg-white px-4 py-2 text-sm font-medium text-gray-700 
                    shadow-sm hover:bg-gray-50 hover:shadow-md active:scale-[0.98] 
                    transition-all duration-200 ease-in-out"
        >
          Login
        </button>

      </form>

      <p className="mt-3">{msg}</p>

      {/* ✅ Bottom navigation text */}
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
