import { useState } from "react";
import api from "../utils/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "member" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // eslint-disable-next-line no-unused-vars
      const { data } = await api.post("/auth/register", form);
      setMsg("✅ Registered successfully! You can now log in.");
    } catch (err) {
      setMsg("❌ " + err.response.data.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-eggplant">
      <h1 className="text-3xl mb-4 font-bold">Register</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
        <input name="name" placeholder="Name" onChange={handleChange} className="p-2 rounded" />
        <input name="email" placeholder="Email" onChange={handleChange} className="p-2 rounded" />
        <input name="password" placeholder="Password" type="password" onChange={handleChange} className="p-2 rounded" />
        <select name="role" onChange={handleChange} className="p-2 rounded">
          <option value="member">Member</option>
          <option value="manager">Manager</option>
        </select>
        <button className="bg-eggplant text-white p-2 rounded hover:bg-dimgray">Register</button>
      </form>
      <p className="mt-3">{msg}</p>
    </div>
  );
}
