import { useState, useContext } from "react";
import api from "../utils/api";
import { AuthContext } from "../context/AuthProvider.jsx";

export default function AskQuestion() {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({ title: "", description: "", tags: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        "/questions",
        {
          title: form.title,
          description: form.description,
          tags: form.tags.split(",").map((t) => t.trim()),
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setMsg("✅ Question posted successfully!");
      setForm({ title: "", description: "", tags: "" });
    } catch (err) {
      setMsg("❌ " + err.response.data.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-eggplant">
      <h1 className="text-3xl font-bold mb-4">Ask a Question</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-96">
        <input
          name="title"
          value={form.title}
          placeholder="Title"
          onChange={handleChange}
          className="p-2 rounded"
        />
        <textarea
          name="description"
          value={form.description}
          placeholder="Description"
          onChange={handleChange}
          className="p-2 rounded"
        />
        <input
          name="tags"
          value={form.tags}
          placeholder="Tags (comma separated)"
          onChange={handleChange}
          className="p-2 rounded"
        />
        <button className="bg-eggplant text-white p-2 rounded hover:bg-dimgray">
          Post Question
        </button>
      </form>
      <p className="mt-3">{msg}</p>
    </div>
  );
}
