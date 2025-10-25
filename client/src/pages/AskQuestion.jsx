// src/pages/AskQuestion.jsx
import { useState, useContext } from "react";
import api from "../utils/api";
import AuthContext from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";

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
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setLoading(false);
      // Redirect to feed after posting
      navigate("/feed");
    } catch (err) {
      setLoading(false);
      alert(err.response?.data?.message || "Error posting question");
    }
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-2xl bg-white p-6 rounded shadow">
        <h1 className="text-3xl font-bold mb-4 text-center">Ask a Question</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Question title"
            className="p-3 border rounded"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your question..."
            className="p-3 border rounded h-40"
            required
          />
          <input
            value={tags}
            placeholder="Tags (comma separated)"
            onChange={(e) => setTags(e.target.value)}
            className="p-3 border rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-eggplant text-pearl py-2 rounded hover:bg-pearl hover:text-eggplant transition"
          >
            {loading ? "Posting..." : "Post Question"}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link to="/feed" className="underline">View All Questions</Link>
        </div>
      </div>
    </div>
  );
}
