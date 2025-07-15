import { useEffect, useRef, useState } from "react";
import Navbar from "../navigation/Navbar";
import useAxios from "../hooks/UseAxios";
import "../../style/pages/Dashboard.scss";
import DashboardQuizList from "../lists/DashboardQuizList";
import Question from "../model/Question";
import { FaDesktop, FaTrophy } from "react-icons/fa";
import WebSocketManager from "../hooks/WebSocketManager";
import GroupsList from "../lists/GroupsList";

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState({});
  const [projectorWindow, setProjectorWindow] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [groups, setGroups] = useState([]);

  const wsManager = useRef(null);
  const broadcastChannel = useRef(null);

  useEffect(() => {
    const initializeComponents = () => {
      broadcastChannel.current = new BroadcastChannel("quiz_channel");

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

      if (!wsManager.current) {
        initializeWebSocket();
      }
    };

    initializeComponents();

    return () => {
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
            useAxios("/category", "get"),
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
            handlePlayerAnswered(JSON.parse(message.payload));
            break;
          case "QUESTION_CANCEL":
            setGroups(JSON.parse(message.payload));
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

  const handlePlayerAnswered = (updatedGroup) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.name === updatedGroup.name ? updatedGroup : group
      )
    );

    if (!broadcastChannel.current) return;

    try {
      broadcastChannel.current.postMessage({
        type: "PLAYER_ANSWERED",
        payload: updatedGroup.name,
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

  const openWinnerStands = async () => {
    const fetchGroups = async () => {
      const response = await useAxios("/group", "get");
      return response.data;
    };

    const groups = await fetchGroups();

    setTimeout(() => {
      if (broadcastChannel.current) {
        broadcastChannel.current.postMessage({
          type: "SHOW_WINNER_STANDS",
          payload: groups,
        });
      }
    }, 1000);
  };

  return (
    <>
      <Navbar />
      {showQuestion ? (
        <>
          <Question quiz={selectedQuiz} onBack={handleBackToDashboard} />
          <GroupsList groups={groups} mode={'light'} />
        </>
      ) : (
        <div className="dashboard">
          <div className="action-buttons">
            <button
              className="projector-button"
              onClick={openProjector}
              title="Open Projector View"
            >
              <FaDesktop className="button-icon" />
              <span>Projector View</span>
            </button>
            <button
              className="winner-stands-button"
              onClick={openWinnerStands}
              title="Winner Stands"
            >
              <FaTrophy className="button-icon" />
              <span>Winner Stands</span>
            </button>
          </div>
          {!isConnected && <div className="loader"></div>}
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
