import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../context/AuthProvider.jsx";

export default function QuestionDetail() {
  const { id } = useParams(); // from route like /questions/:id
  const { user } = useContext(AuthContext);
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch question + answers
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.token) return; // Prevent API calls if user not ready
      setLoading(true);
      try {
        // Get all questions (or ideally, /questions/:id from your backend)
        const q = await api.get("/questions", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const target = q.data.find((item) => item._id === id);
        setQuestion(target);

        // Get answers for this question
        const a = await api.get(`/answers/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAnswers(a.data);
      } catch (err) {
        console.error("Error fetching question or answers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user?.token]); // ✅ Added user?.token to dependencies

  // ✅ Post new answer
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    try {
      await api.post(
        "/answers",
        { questionId: id, answerText: newAnswer },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setNewAnswer("");

      // Refresh answers after posting
      const a = await api.get(`/answers/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setAnswers(a.data);
    } catch (err) {
      console.error("Error posting answer:", err);
    }
  };

  if (loading) return <p className="text-center p-6">Loading...</p>;
  if (!question) return <p className="text-center p-6">Question not found.</p>;

  return (
    <div className="p-6 text-eggplant">
      {/* Question title and description */}
      <h1 className="text-3xl font-bold mb-2">{question.title}</h1>
      <p className="text-dimgray mb-3">{question.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {question.tags?.map((t, i) => (
          <span key={i} className="bg-pearl px-2 py-1 rounded-full text-sm">
            #{t}
          </span>
        ))}
      </div>

      {/* Answers */}
      <h2 className="text-2xl mb-2">Answers</h2>
      {answers.length === 0 ? (
        <p>No answers yet. Be the first to answer!</p>
      ) : (
        answers.map((ans) => (
          <div key={ans._id} className="p-3 mb-2 bg-lavender rounded">
            <p>{ans.answerText}</p>
            <p className="text-xs mt-1 text-dimgray">
              By {ans.createdBy?.name || "Anonymous"} ({ans.createdBy?.role || "User"})
            </p>
          </div>
        ))
      )}

      {/* Answer form */}
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
        <textarea
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          placeholder="Write your answer..."
          className="p-2 rounded border"
          rows="4"
        />
        <button
          type="submit"
          className="bg-eggplant text-white rounded p-2 hover:bg-dimgray"
        >
          Post Answer
        </button>
      </form>
    </div>
  );
}
