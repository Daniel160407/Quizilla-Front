import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/pages/Dashboard";
import Categories from "./components/pages/Categories";
import Quizzes from "./components/pages/Quizzes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/quizzes" element={<Quizzes />} />
      </Routes>
    </Router>
  );
}

export default App;
