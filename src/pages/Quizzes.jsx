import { useEffect, useState } from "react";
import Navbar from "../components/navigation/Navbar";
import useAxios from "../components/hooks/UseAxios";
import QuizList from "../components/lists/QuizList";
import AddQuizBtn from "../components/uiComponents/AddQuizBtn";
import QuizForm from "../components/forms/QuizForm";
import Cookies from "js-cookie";
import "../style/pages/Quizzes.scss";

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFormForCategory, setShowFormForCategory] = useState(null);
  const [types, setTypes] = useState([]);

  const gameId = Cookies.get('gameId');

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const response = await useAxios.get(`/quiz?gameid=${gameId}`);
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
        const response = await useAxios.get(`/category?gameid=${gameId}`);
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
      const response = await useAxios.post("/quiz", quizData);

      setQuizzes(response.data);

      if (!types.includes(response.data.type)) {
        setTypes((prevTypes) => [...prevTypes, response.data.type]);
      }

      setShowFormForCategory(null);
    } catch (err) {
      setError(err.message || "Failed to create quiz");
    }
  };

  const handleEdit = async (data) => {
    const response = await useAxios.put("/quiz", data);
    setQuizzes(response.data);
  };

  const handleDelete = async (id) => {
    const response = await useAxios.delete(`/quiz?id=${id}`);
    setQuizzes(response.data);
  };

  return (
    <>
      <Navbar />
      <div className="quizzes">
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
                <QuizList
                  quizzes={categoryQuizzes}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
                <AddQuizBtn
                  onClick={() => setShowFormForCategory(category.id)}
                />
                {showFormForCategory === category.id && (
                  <QuizForm
                    types={types}
                    gameId={gameId}
                    categoryId={category.id}
                    onSubmit={handleSubmit}
                    onCancel={() => setShowFormForCategory(null)}
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
