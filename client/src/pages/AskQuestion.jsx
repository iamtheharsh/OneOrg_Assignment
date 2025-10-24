// src/pages/AskQuestion.jsx
import { useState, useContext } from "react";
import api from "../utils/api";
import AuthContext from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function AskQuestion() {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post(
        "/questions",
        {
          title,
          description,
          tags: tags.split(",").map((tag) => tag.trim()),
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      navigate("/feed");
    } catch (err) {
      console.error("Error posting question:", err.response?.data || err.message);
      alert("Failed to post question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-lavender rounded shadow">
      <h1 className="text-3xl font-bold mb-4 text-center">Ask a Question</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Question title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <textarea
          placeholder="Describe your question..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2 border rounded h-32"
          required
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-eggplant text-pearl py-2 rounded hover:bg-pearl hover:text-eggplant transition"
        >
          {loading ? "Posting..." : "Post Question"}
        </button>
      </form>
    </div>
  );
}
