import { useState, useEffect, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import AuthContext from "../context/AuthContext.jsx";

export default function QuestionDetail() {
  const { id } = useParams(); // questionId from route
  const { user } = useContext(AuthContext);
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch question + answers (memoized)
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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Post answer
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;
    try {
      await api.post(
        "/answers",
        { questionId: id, content: newAnswer },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setNewAnswer("");
      fetchData(); // reload answers
    } catch (err) {
      alert(err.response?.data?.message || "Error posting answer");
    }
  };

  if (loading)
    return <p className="text-center text-dimgray p-6">Loading question...</p>;

  if (!question)
    return <p className="text-center text-dimgray p-6">Question not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{question.title}</h1>
        <p className="text-dimgray mb-4">{question.description}</p>
        <div className="flex gap-2 mb-2">
          {question.tags.map((t, i) => (
            <span
              key={i}
              className="bg-pearl text-eggplant text-sm px-2 py-1 rounded-full"
            >
              #{t}
            </span>
          ))}
        </div>
        <p className="text-xs text-dimgray">
          By {question.createdBy?.name || "Unknown"} ({question.createdBy?.role})
        </p>
      </div>

      <hr className="mb-6" />

      <h2 className="text-2xl font-semibold mb-3">Answers</h2>

      {answers.length === 0 ? (
        <p className="italic text-dimgray mb-4">No answers yet.</p>
      ) : (
        answers.map((ans) => (
          <div
            key={ans._id}
            className="p-3 mb-2 bg-lavender rounded shadow-sm"
          >
            <p>{ans.answerText}</p>
            <p className="text-xs text-dimgray mt-1">
              By {ans.createdBy?.name || "Anonymous"} ({ans.createdBy?.role})
            </p>
          </div>
        ))
      )}

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
        <textarea
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          placeholder="Write your answer..."
          className="p-3 border rounded h-32"
        />
        <button className="bg-eggplant text-pearl py-2 rounded hover:bg-pearl hover:text-eggplant transition">
          Post Answer
        </button>
      </form>
    </div>
  );
}
