import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./context/AuthContext.jsx";
import ManagerDashboard from "./pages/ManagerDashboard.jsx";

// Pages
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AskQuestion from "./pages/AskQuestion.jsx";
import QuestionFeed from "./pages/QuestionFeed.jsx";
import QuestionDetail from "./pages/QuestionDetail.jsx";

// Components
import Navbar from "./components/Navbar.jsx";

export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Navbar />
      <div className="min-h-screen bg-pearl text-eggplant">
        <Routes>
          {/* Redirect root */}
          <Route path="/" element={<Navigate to={user ? "/feed" : "/login"} />} />

          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Pages */}
          {user && (
            <>
              <Route path="/feed" element={<QuestionFeed />} />
              <Route path="/ask" element={<AskQuestion />} />
              <Route path="/question/:id" element={<QuestionDetail />} />

              {/* Manager-only route */}
              {user.role === "manager" && (
                <Route path="/manager" element={<ManagerDashboard />} />
              )}
            </>
          )}

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}
