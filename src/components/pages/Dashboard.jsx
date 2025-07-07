import { useEffect, useState } from "react";
import Navbar from "../navigation/Navbar";
import useAxios from "../hooks/UseAxios";
import "../../style/pages/Dashboard.scss";
import DashboardQuizList from "../lists/DashboardQuizList";
import Question from "../model/Question";
import { FaDesktop } from "react-icons/fa";

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState({});
  const [projectorWindow, setProjectorWindow] = useState(null);
  const [broadcastChannel, setBroadcastChannel] = useState(null);

  useEffect(() => {
    const channel = new BroadcastChannel("quiz_channel");
    setBroadcastChannel(channel);

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

  const handleQuizClick = (quiz) => {
    setSelectedQuiz(quiz);
    setShowQuestion(true);
    useAxios(`/quiz/enable?id=${quiz.id}&enable=${false}`, "put");

    if (broadcastChannel) {
      broadcastChannel.postMessage({
        type: "QUIZ_SELECTED",
        payload: quiz,
      });
    }
  };

  const handleBackToDashboard = () => {
    setShowQuestion(false);
  };

  const openProjector = () => {
    const win = window.open("/projector", "_blank", "width=1200,height=800");
    setProjectorWindow(win);

    if (selectedQuiz && Object.keys(selectedQuiz).length > 0) {
      setTimeout(() => {
        broadcastChannel.postMessage({
          type: "QUIZ_SELECTED",
          payload: selectedQuiz,
        });
      }, 1000);
    }
  };

  return (
    <>
      <Navbar />
      {showQuestion ? (
        <Question quiz={selectedQuiz} onBack={handleBackToDashboard} />
      ) : (
        <div className="dashboard">
          <button
            className="projector-button"
            onClick={openProjector}
            title="Open Projector View"
          >
            <FaDesktop className="projector-icon" />
            <span>Projector View</span>
          </button>

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
                  <DashboardQuizList
                    quizzes={categoryQuizzes}
                    onQuizClick={handleQuizClick}
                  />
                </div>
              );
            })
          )}
        </div>
      )}
    </>
  );
};

export default Dashboard;
