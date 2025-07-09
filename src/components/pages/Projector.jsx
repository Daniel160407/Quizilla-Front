import { useEffect, useState } from "react";
import useAxios from "../hooks/UseAxios";
import "../../style/pages/Projector.scss";
import ProjectorQuizList from "../lists/ProjectorQuizList";
import ProjectorQuestion from "../model/ProjectorQuestion";

const Projector = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState({});
  const [broadcastChannel, setBroadcastChannel] = useState(null);

  useEffect(() => {
    const channel = new BroadcastChannel("quiz_channel");
    setBroadcastChannel(channel);

    channel.onmessage = (event) => {
      switch (event.data.type) {
        case "QUIZ_SELECTED":
          setSelectedQuiz(event.data.payload);
          setShowQuestion(true);
          break;
        case "QUIZ_CENCELED":
          selectedQuiz.enabled = 1;
          setShowQuestion(false);
          break;
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  useEffect(() => {
    if (showQuestion === false) {
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
    }
  }, [showQuestion]);

  return (
    <>
      {showQuestion ? (
        <ProjectorQuestion quiz={selectedQuiz} />
      ) : (
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
                  <ProjectorQuizList quizzes={categoryQuizzes} />
                </div>
              );
            })
          )}
        </div>
      )}
    </>
  );
};

export default Projector;
