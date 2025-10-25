import { useState, useEffect, useContext, useCallback } from "react";
import api from "../utils/api";
import AuthContext from "../context/AuthContext.jsx";

export default function ManagerDashboard() {
  const { user } = useContext(AuthContext);
  const [insights, setInsights] = useState([]);
  const [questionId, setQuestionId] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);

  const fetchInsights = useCallback(async () => {
    try {
      const { data } = await api.get("/insights", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setInsights(data);
    } catch (err) {
      console.error("Error fetching insights:", err.response?.data || err.message);
    }
  }, [user.token]);

  const fetchQuestions = useCallback(async () => {
    try {
      const { data } = await api.get("/questions", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setQuestions(data);
      if (data.length > 0) setQuestionId(data[0]._id);
    } catch (err) {
      console.error("Error fetching questions:", err.response?.data || err.message);
    }
  }, [user.token]);

  useEffect(() => {
    fetchInsights();
    fetchQuestions();
  }, [fetchInsights, fetchQuestions]); // ✅ now valid dependencies

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!questionId || !summary.trim()) {
      alert("Please select a question and write a summary.");
      return;
    }
    setLoading(true);
    try {
      await api.post(
        "/insights",
        { questionId, summary },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setSummary("");
      fetchInsights(); // safely re-fetch
    } catch (err) {
      alert(err.response?.data?.message || "Error creating insight");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Manager Insights</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-lavender p-4 rounded mb-6 flex flex-col gap-3"
      >
        <label className="font-semibold text-sm">Select Question</label>
        <select
          value={questionId}
          onChange={(e) => setQuestionId(e.target.value)}
          className="p-2 rounded border"
        >
          {questions.length === 0 ? (
            <option>No questions available</option>
          ) : (
            questions.map((q) => (
              <option key={q._id} value={q._id}>
                {q.title || "Untitled Question"}
              </option>
            ))
          )}
        </select>

        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Write your insight summary..."
          className="p-2 rounded border h-24"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-eggplant text-white p-2 rounded hover:bg-dimgray transition"
        >
          {loading ? "Adding..." : "Add Insight"}
        </button>
      </form>

      <div className="flex flex-col gap-4">
        {insights.length === 0 ? (
          <p className="text-center text-dimgray">No insights yet.</p>
        ) : (
          insights.map((i) => (
            <div key={i._id} className="p-4 bg-pearl rounded shadow">
              <h2 className="font-semibold text-lg">{i.questionId?.title}</h2>
              <p className="text-sm mt-1">{i.summary}</p>
              <p className="text-xs mt-2 text-dimgray">
                By {i.createdBy?.name} ({i.createdBy?.role})
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
