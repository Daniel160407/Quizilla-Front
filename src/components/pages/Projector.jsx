import { useEffect, useRef, useState } from "react";
import useAxios from "../hooks/UseAxios";
import "../../style/pages/Projector.scss";
import ProjectorQuizList from "../lists/ProjectorQuizList";
import ProjectorQuestion from "../model/ProjectorQuestion";
import Instructions from "./Instructions";
import WebSocketManager from "../hooks/WebSocketManager";

const Projector = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState({});
  const [broadcastChannel, setBroadcastChannel] = useState(null);
  const [playersAnswered, setPlayersAnswered] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const wsManager = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    const channel = new BroadcastChannel("quiz_channel");
    setBroadcastChannel(channel);

    channel.onmessage = (event) => {
      switch (event.data.type) {
        case "QUIZ_SELECTED":
          setSelectedQuiz(event.data.payload);
          setShowQuestion(true);
          break;
        case "QUIZ_CANCELED":
          setSelectedQuiz(prev => ({...prev, enabled: 1}));
          setShowQuestion(false);
          setPlayersAnswered([]);
          break;
        case "PLAYER_ANSWERED":
          setPlayersAnswered((prev) => [...prev, event.data.payload]);
          break;
        case "SHOW_INSTRUCTIONS":
          setShowInstructions(event.data.payload);
          break;
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  useEffect(() => {
    initializeWebSocket();

    return () => {
      if (wsManager.current) {
        wsManager.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (showQuestion === false) {
      fetchData();
    }
  }, [showQuestion]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [quizzesRes, categoriesRes] = await Promise.all([
        useAxios("/quiz", "get"),
        useAxios("/category", "get")
      ]);
      setQuizzes(quizzesRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const initializeWebSocket = () => {
    if (wsManager.current?.isConnected()) {
      return;
    }

    wsManager.current = new WebSocketManager("/socket");

    wsManager.current.addConnectionListener("open", () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      setError(null);
      reconnectAttempts.current = 0;
    });

    wsManager.current.addConnectionListener("close", () => {
      setIsConnected(false);
      if (reconnectAttempts.current < maxReconnectAttempts) {
        const delay = Math.min(3000 * (reconnectAttempts.current + 1), 15000);
        setError(`Connection lost. Reconnecting in ${delay/1000} seconds...`);
        
        setTimeout(() => {
          reconnectAttempts.current += 1;
          initializeWebSocket();
        }, delay);
      } else {
        setError("Max reconnection attempts reached. Please refresh the page.");
      }
    });

    wsManager.current.addConnectionListener("error", (err) => {
      console.error("WebSocket error:", err);
      setIsConnected(false);
      setError("Connection error. Attempting to reconnect...");
    });

    wsManager.current.connect();
  };

  const sendWebSocketMessage = (message) => {
    if (!wsManager.current?.isConnected()) {
      setError("Cannot send message - not connected to WebSocket");
      return false;
    }

    try {
      wsManager.current.send(message);
      return true;
    } catch (err) {
      console.error("Failed to send WebSocket message:", err);
      setError("Failed to send message. Trying to reconnect...");
      initializeWebSocket();
      return false;
    }
  };

  const handleTimeUp = () => {
    sendWebSocketMessage({
      sender: "projector",
      type: "QUESTION_CANCEL",
      payload: selectedQuiz.id || ""
    });
  };

  const handleQuizStarted = () => {
    sendWebSocketMessage({
      sender: "projector",
      type: "QUIZ_START",
      payload: selectedQuiz.id || ""
    });
  };

  return (
    <>
      {showQuestion ? (
        <ProjectorQuestion
          quiz={selectedQuiz}
          playersAnswered={playersAnswered}
          onTimeUp={handleTimeUp}
          quizStarted={handleQuizStarted}
        />
      ) : !showInstructions ? (
        <div className="projector-dashboard">
          {error && <p className="error">{error}</p>}
          {loading ? (
            <p>Loading...</p>
          ) : (
            categories.map((category) => (
              <div key={category.id} className="category">
                <h2>{category.name}</h2>
                <ProjectorQuizList 
                  quizzes={quizzes.filter(q => q.categoryId === category.id)} 
                />
              </div>
            ))
          )}
        </div>
      ) : (
        <Instructions />
      )}
    </>
  );
};

export default Projector;