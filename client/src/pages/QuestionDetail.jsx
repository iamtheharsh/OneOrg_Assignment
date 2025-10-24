import { useState, useEffect, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import AuthContext from "../context/AuthContext.jsx";

export default function QuestionDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [insights, setInsights] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [newInsight, setNewInsight] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Stable fetch functions
  const fetchQuestion = useCallback(async () => {
    try {
      const { data: questionData } = await api.get(`/questions/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setQuestion(questionData);
    } catch (err) {
      console.error("❌ Error fetching question:", err.response?.data || err.message);
      setQuestion(null);
    }
  }, [id, user.token]);

  const fetchAnswers = useCallback(async () => {
    try {
      const { data: answersData } = await api.get(`/answers/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setAnswers(answersData);
    } catch (err) {
      console.error("❌ Error fetching answers:", err.response?.data || err.message);
      setAnswers([]);
    }
  }, [id, user.token]);

  const fetchInsights = useCallback(async () => {
    try {
      const { data: insightsData } = await api.get(`/insights/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setInsights(insightsData);
    } catch (err) {
      console.error("❌ Error fetching insights:", err.response?.data || err.message);
      setInsights([]);
    }
  }, [id, user.token]);

  // ✅ Submit new answer
  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;
    try {
      await api.post(
        "/answers",
        { questionId: id, content: newAnswer },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setNewAnswer("");
      fetchAnswers();
    } catch (err) {
      console.error("❌ Error submitting answer:", err.response?.data || err.message);
    }
  };

  // ✅ Submit new insight (manager only)
  const handleInsightSubmit = async (e) => {
    e.preventDefault();
    if (!newInsight.trim()) return;
    try {
      await api.post(
        "/insights",
        { questionId: id, summary: newInsight },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setNewInsight("");
      fetchInsights();
    } catch (err) {
      console.error("❌ Error submitting insight:", err.response?.data || err.message);
    }
  };

  const handleUpvote = async (answerId) => {
    try {
      await api.put(
        `/answers/upvote/${answerId}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      fetchAnswers();
    } catch (err) {
      console.error("❌ Error upvoting answer:", err.response?.data || err.message);
    }
  };

  // ✅ Initial fetch
  useEffect(() => {
    const init = async () => {
      await fetchQuestion();
      await fetchAnswers();
      await fetchInsights();
      setLoading(false);
    };
    init();
  }, [fetchQuestion, fetchAnswers, fetchInsights]);

  // 💬 Loading state
  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-dimgray animate-pulse">Loading question...</p>
      </div>
    );

  // 💬 Not found
  if (!question)
    return (
      <div className="p-6 text-center text-dimgray italic">
        Question not found.
      </div>
    );

  return (
    <div className="p-6 max-w-3xl mx-auto bg-lavender rounded shadow">
      <h1 className="text-3xl font-bold mb-2">{question.title}</h1>
      <p className="text-dimgray mb-4">{question.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {question.tags.map((tag, i) => (
          <span
            key={i}
            className="bg-pearl text-eggplant px-2 py-1 rounded-full text-sm"
          >
            #{tag}
          </span>
        ))}
      </div>

      <p className="text-sm text-right text-dimgray">
        Asked by {question.createdBy?.name || "Anonymous"}
      </p>

      {/* Answers Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">
          Answers ({answers.length})
        </h2>

        <form onSubmit={handleAnswerSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Write your answer..."
            className="flex-grow p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-eggplant text-pearl px-4 py-2 rounded hover:bg-pearl hover:text-eggplant transition"
          >
            Post
          </button>
        </form>

        {answers.length === 0 ? (
          <p className="text-center text-dimgray italic">No answers yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {answers.map((a) => (
              <div
                key={a._id}
                className="p-3 bg-pearl rounded shadow-sm hover:shadow-md transition"
              >
                <p className="text-sm">{a.content}</p>
                <div className="flex justify-between text-xs mt-2 text-dimgray">
                  <span>By {a.createdBy?.name || "User"}</span>
                  <button
                    onClick={() => handleUpvote(a._id)}
                    className="hover:underline"
                  >
                    🔼 {a.upvotes?.length || 0}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Insights Section (Manager only) */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Insights</h2>

        {user?.role === "manager" && (
          <form onSubmit={handleInsightSubmit} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newInsight}
              onChange={(e) => setNewInsight(e.target.value)}
              placeholder="Write a summary insight..."
              className="flex-grow p-2 border rounded"
            />
            <button
              type="submit"
              className="bg-eggplant text-pearl px-4 py-2 rounded hover:bg-pearl hover:text-eggplant transition"
            >
              Add Insight
            </button>
          </form>
        )}

        {insights.length === 0 ? (
          <p className="text-center text-dimgray italic">
            No insights yet. {user?.role === "manager" && "Add one above!"}
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {insights.map((insight) => (
              <div
                key={insight._id}
                className="p-3 bg-pearl rounded shadow-sm hover:shadow-md transition"
              >
                <p className="text-sm italic">"{insight.summary}"</p>
                <p className="text-xs text-right text-dimgray mt-2">
                  — {insight.createdBy?.name || "Manager"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
