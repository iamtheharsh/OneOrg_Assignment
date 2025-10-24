import { useContext, useState } from "react";
import api from "../utils/api";
import { AuthContext } from "../context/AuthProvider";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", form);
      login(data);
      setMsg("✅ Login successful!");
    } catch (err) {
      setMsg("❌ " + err.response.data.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-eggplant">
      <h1 className="text-3xl mb-4 font-bold">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
        <input name="email" placeholder="Email" onChange={handleChange} className="p-2 rounded" />
        <input name="password" placeholder="Password" type="password" onChange={handleChange} className="p-2 rounded" />
        <button className="bg-eggplant text-white p-2 rounded hover:bg-dimgray">Login</button>
      </form>
      <p className="mt-3">{msg}</p>
    </div>
  );
}
