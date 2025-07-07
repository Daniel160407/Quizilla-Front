import { useEffect, useState } from "react";
import Navbar from "../navigation/Navbar";
import useAxios from "../hooks/UseAxios";
import "../../style/Dashboard.scss";
import QuizList from "../lists/QuizList";

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const response = await useAxios("/quiz", "get");
        setQuizzes(response.data);
      } catch (err) {
        setError(err.message || "Failed to load quizzes");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await useAxios("/category", "get");
        setCategories(response.data);
      } catch (err) {
        setError(err.message || "Failed to load categories");
      }
    };

    fetchQuizzes();
    fetchCategories();
  }, []);

  return (
    <>
      <Navbar />
      <div className="dashboard">
        {error && <p className="error">{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          categories.map((category) => {
            const categoryQuizzes = quizzes.filter(
              (quiz) => quiz.categoryId === category.id
            );
            return (
              <div key={category.id} className="category">
                <h2>{category.name}</h2>
                <QuizList quizzes={categoryQuizzes} />
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default Dashboard;
