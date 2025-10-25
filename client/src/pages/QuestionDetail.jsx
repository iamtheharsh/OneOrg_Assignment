import { useState, useEffect, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import AuthContext from "../context/AuthContext.jsx";

export default function QuestionDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [success, setSuccess] = useState(false);

  // ✅ Stable fetch function with useCallback
  const fetchData = useCallback(async () => {
    try {
      const { data: allQuestions } = await api.get("/questions", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const q = allQuestions.find((item) => item._id === id);
      setQuestion(q || null);

      const { data: ans } = await api.get(`/answers/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setAnswers(ans);
    } catch (err) {
      console.error("Error fetching question/answers:", err);
    } finally {
      setLoading(false);
    }
  }, [id, user.token]);

  // ✅ Effect depends only on fetchData (which depends on id + token)
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    setPosting(true);
    try {
      await api.post(
        "/answers",
        { questionId: id, content: newAnswer },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setNewAnswer("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      fetchData(); // refresh answers
    } catch (err) {
      alert(err.response?.data?.message || "Error posting answer");
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <p className="text-center p-6">Loading...</p>;

  if (!question) return <p className="text-center p-6">Question not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto text-eggplant">
      {/* 🔹 Question Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{question.title}</h1>
        <p className="mb-4">{question.description}</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {question.tags?.map((t, i) => (
            <span key={i} className="bg-pearl px-2 py-1 rounded-full text-sm">
              #{t}
            </span>
          ))}
        </div>
        <p className="text-xs text-dimgray">
          By {question.createdBy?.name} ({question.createdBy?.role})
        </p>
      </div>

      <hr className="mb-4" />

      {/* 🔹 Answers Section */}
      <h2 className="text-2xl font-semibold mb-3">Answers</h2>

      {answers.length === 0 ? (
        <p className="italic text-dimgray mb-4">No answers yet.</p>
      ) : (
        answers.map((ans) => (
          <div
            key={ans._id}
            className="p-3 mb-2 bg-lavender rounded border border-pearl"
          >
            <p className="text-sm">{ans.content}</p>
            <p className="text-xs text-dimgray mt-1">
              By {ans.createdBy?.name} ({ans.createdBy?.role}) ·{" "}
              {new Date(ans.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}

      {/* 🔹 Post New Answer */}
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
        <textarea
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          placeholder="Write your answer..."
          className="p-3 border rounded h-32 text-eggplant"
        />
        <button
          type="submit"
          disabled={posting}
          className={`bg-eggplant text-pearl py-2 rounded font-semibold transition ${
            posting ? "opacity-70 cursor-not-allowed" : "hover:bg-dimgray"
          }`}
        >
          {posting ? "Posting..." : "➕ Post Answer"}
        </button>
        {success && (
          <p className="text-green-600 text-sm font-medium text-center">
            ✅ Answer posted successfully!
          </p>
        )}
      </form>
    </div>
  );
}
