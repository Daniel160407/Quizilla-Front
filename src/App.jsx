import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminPanel from "./pages/AdminPanel";
import Projector from "./pages/Projector";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/adminpanel" element={<AdminPanel />} />
        <Route path="/projector" element={<Projector />} />
      </Routes>
    </Router>
  );
}

export default App;