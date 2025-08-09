import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Quizzes from "./pages/Quizzes";
import Projector from "./pages/Projector";
import Client from "./pages/Client";
import Groups from "./pages/Groups";
import Games from "./pages/Games";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Client />} />
        <Route path="/games" element={<Games />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/projector" element={<Projector />} />
      </Routes>
    </Router>
  );
}

export default App;
