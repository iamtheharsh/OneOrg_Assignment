import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import AuthContext from "../context/AuthContext.jsx";

export default function QuestionFeed() {
  const { user } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch questions (with optional search)
  const fetchQuestions = async (q = search) => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/questions?search=${encodeURIComponent(q)}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setQuestions(data);
    } catch (err) {
      console.error("Error fetching questions:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // refetch when search changes with a small debounce
  useEffect(() => {
    const t = setTimeout(() => fetchQuestions(search), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="p-6 text-eggplant max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">All Questions</h1>

      <div className="flex justify-center mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or tag..."
          className="p-3 w-full max-w-2xl rounded border"
        />
      </div>

      {loading ? (
        <p className="text-center text-dimgray">Loading...</p>
      ) : questions.length === 0 ? (
        <p className="text-center text-dimgray">No questions found.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {questions.map((q) => (
            <div
              key={q._id}
              className="p-4 bg-white rounded-lg shadow-sm border"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-4">
                  <Link to={`/question/${q._id}`}>
                    <h2 className="text-xl font-semibold hover:underline">{q.title || "Untitled"}</h2>
                  </Link>

                  <p className="text-sm text-dimgray mt-2">
                    {q.description?.length > 250
                      ? q.description.slice(0, 250) + "…"
                      : q.description}
                  </p>

                  <div className="flex flex-wrap gap-2 text-sm mt-3">
                    {(q.tags && q.tags.length > 0 ? q.tags : []).map((t, i) => (
                      <span key={i} className="bg-pearl text-eggplant px-2 py-1 rounded-full">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-dimgray">
                    By {q.createdBy?.name || "Unknown"} ({q.createdBy?.role || "member"})
                  </p>

                  <Link
                    to={`/question/${q._id}`}
                    className="inline-block mt-4 px-3 py-1 border rounded bg-eggplant text-pearl hover:bg-pearl hover:text-eggplant transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
