import { useEffect, useState, useContext } from "react";
import api from "../utils/api";
import AuthContext from "../context/AuthContext.jsx";

export default function ManagerDashboard() {
  const { user } = useContext(AuthContext);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const { data } = await api.get("/insights", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setInsights(data);
      } catch (err) {
        console.error("❌ Error fetching insights:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [user.token]); // ✅ only depends on token

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-dimgray animate-pulse">Loading manager dashboard...</p>
      </div>
    );

  if (insights.length === 0)
    return (
      <div className="p-6 text-center text-dimgray italic">
        No insights found yet.
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Manager Dashboard</h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg shadow-sm bg-pearl">
          <thead className="bg-eggplant text-pearl">
            <tr>
              <th className="p-3 text-left">Question</th>
              <th className="p-3 text-left">Insight Summary</th>
              <th className="p-3 text-left">Manager</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {insights.map((i) => (
              <tr key={i._id} className="border-b border-gray-200 hover:bg-lavender">
                <td className="p-3 w-1/3">
                  <p className="font-medium text-eggplant">{i.questionId?.title}</p>
                  <p className="text-xs text-dimgray truncate">
                    {i.questionId?.description}
                  </p>
                </td>
                <td className="p-3 italic text-sm">"{i.summary}"</td>
                <td className="p-3 text-sm">{i.createdBy?.name || "Unknown"}</td>
                <td className="p-3 text-xs text-dimgray">
                  {new Date(i.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
