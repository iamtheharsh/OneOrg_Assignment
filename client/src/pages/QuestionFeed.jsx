import { useState, useEffect, useContext } from "react";
import api from "../utils/api";
import { AuthContext } from "../context/AuthProvider.jsx";

export default function QuestionFeed() {
  const { user } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");

  const fetchQuestions = async () => {
    try {
      const { data } = await api.get(`/questions?search=${search}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setQuestions(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [search]);

  return (
    <div className="p-6 text-eggplant">
      <h1 className="text-3xl font-bold mb-4">All Questions</h1>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by title or tag..."
        className="p-2 mb-4 w-full rounded border"
      />

      <div className="flex flex-col gap-4">
        {questions.map((q) => (
          <div key={q._id} className="p-4 bg-lavender rounded shadow">
            <h2 className="text-xl font-semibold">{q.title}</h2>
            <p className="text-sm text-dimgray mb-2">{q.description}</p>
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
            <p className="text-xs mt-2">By {q.createdBy?.name} ({q.createdBy?.role})</p>
          </div>
        ))}
      </div>
    </div>
  );
}
