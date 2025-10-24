// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-eggplant text-pearl px-6 py-3 flex justify-between items-center shadow">
      <Link to={user ? "/feed" : "/"} className="text-2xl font-bold tracking-wide">
        QnA Forum
      </Link>

      {user ? (
        <div className="flex items-center gap-4">
          <Link
            to="/ask"
            className="bg-pearl text-eggplant px-4 py-1 rounded hover:bg-lavender transition"
          >
            Ask Question
          </Link>
          <button
            onClick={handleLogout}
            className="border border-pearl px-3 py-1 rounded hover:bg-lavender hover:text-eggplant transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="bg-pearl text-eggplant px-3 py-1 rounded hover:bg-lavender transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="border border-pearl px-3 py-1 rounded hover:bg-lavender hover:text-eggplant transition"
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}
