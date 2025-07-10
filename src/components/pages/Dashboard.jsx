import { useEffect, useRef, useState } from "react";
import Navbar from "../navigation/Navbar";
import useAxios from "../hooks/UseAxios";
import "../../style/pages/Dashboard.scss";
import DashboardQuizList from "../lists/DashboardQuizList";
import Question from "../model/Question";
import { FaDesktop } from "react-icons/fa";
import WebSocketManager from "../hooks/WebSocketManager";

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState({});
  const [projectorWindow, setProjectorWindow] = useState(null);
  const [broadcastChannel, setBroadcastChannel] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const wsManager = useRef(null);

  useEffect(() => {
    if (!wsManager.current) {
      initializeWebSocket();
    }

    const channel = new BroadcastChannel("quiz_channel");
    setBroadcastChannel(channel);

    channel.onmessage = (event) => {
      switch (event.data.type) {
        case "QUESTION_CANCEL":
          handleTimeUp();
          break;
      }
    };

    return () => {
      if (wsManager.current) {
        wsManager.current.disconnect();
      }
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

  const initializeWebSocket = () => {
    wsManager.current = new WebSocketManager("/socket");

    wsManager.current.connect();

    wsManager.current.addMessageHandler((message) => {
      try {
        switch (message.type) {
          case "PLAYER_ANSWERED":
            handlePlayerAnswered(message.payload);
            break;
          default:
            console.warn("Unhandled message type:", message.type);
        }
      } catch (e) {
        console.error("Error parsing WebSocket message:", e);
      }
    });

    wsManager.current.addConnectionListener("open", () => {
      setIsConnected(true);
      setError(null);
      console.log("connected");
    });

    wsManager.current.addConnectionListener("close", () => {
      setIsConnected(false);
      setError("Connection lost. Trying to reconnect...");

      setTimeout(() => {
        if (!wsManager.current?.isConnected()) {
          initializeWebSocket();
        }
      }, 3000);
    });

    wsManager.current.addConnectionListener("error", (err) => {
      setIsConnected(false);
      setError("Connection error. Attempting to reconnect...");
    });
  };

  const handlePlayerAnswered = (groupName) => {
    if (broadcastChannel) {
      broadcastChannel.postMessage({
        type: "PLAYER_ANSWERED",
        payload: groupName,
      });
    }
  };

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

    wsManager.current.send({
      sender: "admin",
      type: "QUESTION",
      payload: JSON.stringify(quiz),
    });
  };

  const handleBackToDashboard = () => {
    setShowQuestion(false);
    setTimeout(() => {
      broadcastChannel.postMessage({
        type: "QUIZ_CENCELED",
        payload: selectedQuiz,
      });
    }, 1000);

    wsManager.current.send({
      sender: "admin",
      type: "QUESTION_CANCEL",
      payload: '',
    });
  };

  const handleTimeUp = () => {
    wsManager.current.send({
      sender: "admin",
      type: "QUESTION_CANCEL",
      payload: '',
    });
  }

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
