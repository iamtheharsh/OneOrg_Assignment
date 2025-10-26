import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await api.post("/auth/register", form);
    setMsg("✅ Registered successfully!");
    setTimeout(() => navigate("/login"), 1000); // redirect after 1s
  } catch (err) {
    setMsg("❌ " + (err.response?.data?.message || "Registration failed"));
  }
};


  return (
    <div className="flex flex-col items-center justify-center h-screen text-eggplant">
      <h1 className="text-3xl mb-4 font-bold">Register</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          className="p-2 rounded"
        />
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

        <select
          name="role"
          onChange={handleChange}
          className="p-2 rounded border"
        >
          <option value="">Select Role</option>
          <option value="member">Member</option>
          <option value="manager">Manager</option>
        </select>

        {/* ✅ Register button above bottom text */}
        <button
  className="inline-flex items-center justify-center rounded-lg border border-gray-300 
             bg-white px-4 py-2 text-sm font-medium text-gray-700 
             shadow-sm hover:bg-gray-50 hover:shadow-md active:scale-[0.98] 
             transition-all duration-200 ease-in-out"
>
  Register
</button>

      </form>

      <p className="mt-3">{msg}</p>

      {/* ✅ Bottom navigation text */}
      <div className="mt-4 flex justify-center">
        <p className="text-sm text-dimgray">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-eggplant font-semibold hover:underline"
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
