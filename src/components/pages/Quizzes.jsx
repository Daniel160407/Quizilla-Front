import { useEffect, useState } from "react";
import Navbar from "../navigation/Navbar";
import useAxios from "../hooks/UseAxios";
import QuizList from "../lists/QuizList";
import AddQuizBtn from "../uiComponents/AddQuizBtn";
import QuizForm from "../forms/QuizForm";

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const response = await useAxios("/quiz", "get");
        setQuizzes(response.data);
        
        const uniqueTypes = [
          ...new Set(response.data.map((quiz) => quiz.type)),
        ];
        setTypes(uniqueTypes);
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

  const handleSubmit = async (quizData) => {
    try {
      const response = await useAxios("/quiz", "post", quizData);

      setQuizzes((prevQuizzes) => [...prevQuizzes, response.data]);

      if (!types.includes(response.data.type)) {
        setTypes((prevTypes) => [...prevTypes, response.data.type]);
      }

      setShowForm(false);
    } catch (err) {
      setError(err.message || "Failed to create quiz");
    }
  };

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
                <AddQuizBtn onClick={() => setShowForm(true)} />
                {showForm === true && (
                  <QuizForm
                    types={types}
                    categoryId={category.id}
                    onSubmit={handleSubmit}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default Quizzes;
