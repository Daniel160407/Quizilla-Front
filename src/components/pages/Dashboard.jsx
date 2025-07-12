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
  const [isConnected, setIsConnected] = useState(false);

  const wsManager = useRef(null);
  const broadcastChannel = useRef(null);

  useEffect(() => {
    // Initialize WebSocket and BroadcastChannel
    const initializeComponents = () => {
      // Create BroadcastChannel first
      broadcastChannel.current = new BroadcastChannel("quiz_channel");
      
      // Set up message handler
      broadcastChannel.current.onmessage = (event) => {
        switch (event.data.type) {
          case "QUESTION_CANCEL":
            handleTimeUp();
            break;
          case "QUIZ_START":
            handleQuizStart();
            break;
        }
      };

      // Initialize WebSocket if not already done
      if (!wsManager.current) {
        initializeWebSocket();
      }
    };

    initializeComponents();

    return () => {
      // Cleanup function
      if (wsManager.current) {
        wsManager.current.disconnect();
      }
      if (broadcastChannel.current) {
        broadcastChannel.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (showQuestion === false) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const [quizzesResponse, categoriesResponse] = await Promise.all([
            useAxios("/quiz", "get"),
            useAxios("/category", "get")
          ]);
          setQuizzes(quizzesResponse.data);
          setCategories(categoriesResponse.data);
        } catch (err) {
          setError(err.message || "Failed to load data");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
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
        console.error("Error handling WebSocket message:", e);
      }
    });

    wsManager.current.addConnectionListener("open", () => {
      setIsConnected(true);
      setError(null);
      console.log("WebSocket connected");
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
      console.error("WebSocket error:", err);
    });
  };

  const handlePlayerAnswered = (groupName) => {
    if (!broadcastChannel.current) {
      console.error("BroadcastChannel not initialized");
      return;
    }
    
    try {
      broadcastChannel.current.postMessage({
        type: "PLAYER_ANSWERED",
        payload: groupName,
      });
    } catch (e) {
      console.error("Error posting message to BroadcastChannel:", e);
    }
  };

  const handleQuizClick = (quiz) => {
    setSelectedQuiz(quiz);
    setShowQuestion(true);
    
    useAxios(`/quiz/enable?id=${quiz.id}&enable=${false}`, "put");

    if (broadcastChannel.current) {
      broadcastChannel.current.postMessage({
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
      if (broadcastChannel.current) {
        broadcastChannel.current.postMessage({
          type: "QUIZ_CANCELED",
          payload: selectedQuiz,
        });
      }
    }, 1000);

    wsManager.current.send({
      sender: "admin",
      type: "QUESTION_CANCEL",
      payload: "",
    });
  };

  const handleTimeUp = () => {
    wsManager.current.send({
      sender: "admin",
      type: "QUESTION_CANCEL",
      payload: "",
    });
  };

  const handleQuizStart = () => {
    wsManager.current.send({
      sender: "admin",
      type: "QUIZ_START",
      payload: "",
    });
  };

  const openProjector = () => {
    const win = window.open("/projector", "_blank", "width=1200,height=800");
    setProjectorWindow(win);

    if (selectedQuiz && Object.keys(selectedQuiz).length > 0) {
      setTimeout(() => {
        if (broadcastChannel.current) {
          broadcastChannel.current.postMessage({
            type: "QUIZ_SELECTED",
            payload: selectedQuiz,
          });
        }
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