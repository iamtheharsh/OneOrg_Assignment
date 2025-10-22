import { useEffect, useState } from "react";
import api from "./utils/api.js";

function App() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get("/").then(res => setMsg(res.data));
  }, []);

  return (
    <div className="flex justify-center items-center h-screen text-2xl text-eggplant">
      {msg || "Loading..."}
    </div>
  );
}

export default App;
