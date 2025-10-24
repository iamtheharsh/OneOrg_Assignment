import { useState, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import AuthContext from "../context/AuthContext.jsx";

export default function QuestionFeed() {
  const { user } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");

  // ✅ Memoize fetchQuestions to prevent infinite re-renders
  const fetchQuestions = useCallback(async () => {
    try {
      const { data } = await api.get(`/questions?search=${search}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setQuestions(data);
    } catch (err) {
      console.error("❌ Error fetching questions:", err.response?.data || err.message);
    }
  }, [search, user.token]);

  // ✅ Add fetchQuestions to dependency array safely
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

return (
  <div className="p-6 text-eggplant">
    <h1 className="text-3xl font-bold mb-4 text-center">All Questions</h1>

    <div className="flex justify-center mb-6">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by title or tag..."
        className="p-2 w-2/3 rounded border border-dimgray focus:outline-none focus:ring-2 focus:ring-eggplant"
      />
    </div>

    {!questions.length ? (
      <p className="text-center text-dimgray italic">
        {search ? "No results found for your search." : "No questions yet. Be the first to ask!"}
      </p>
    ) : (
      <div className="flex flex-col gap-4">
        {questions.map((q) => (
          <div
            key={q._id}
            className="p-4 bg-lavender rounded-lg shadow hover:shadow-md transition-all duration-200"
          >
            <h2 className="text-xl font-semibold mb-1">{q.title}</h2>
            <p className="text-sm text-dimgray mb-2 line-clamp-2">{q.description}</p>
            <div className="flex flex-wrap gap-2 text-sm">
              {q.tags.map((t, i) => (
                <span
                  key={i}
                  className="bg-pearl text-eggplant px-2 py-1 rounded-full"
                >
                  #{t}
                </span>
              ))}
            </div>
            <p className="text-xs mt-2 text-right text-dimgray">
              By {q.createdBy?.name || "Unknown"} ({q.createdBy?.role || "member"})
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
);
}
