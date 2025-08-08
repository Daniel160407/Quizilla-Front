import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import ClientGroupForm from "../components/forms/ClientGroupForm";
import CharactersList from "../components/lists/CharactersList";
import "../style/pages/Client.scss";
import GroupsList from "../components/lists/GroupsList";
import WebSocketManager from "../components/hooks/WebSocketManager";
import ClientQuestion from "../components/model/ClientQuestion";
import useAxios from "../components/hooks/UseAxios";
import {
  ANSWER,
  CLIENT_ROLE,
  GROUP_CREATED,
  GROUP_CREATION,
  QUESTION,
  QUESTION_CANCEL,
  QUIZ_START,
} from "../Constant";

const Client = () => {
  const [groupName, setGroupName] = useState(Cookies.get("name") ?? "");
  const [showForm, setShowForm] = useState(!Cookies.get("name"));
  const [showCharacters, setShowCharacters] = useState(false);
  const [characterName, setCharacterName] = useState("");
  const [group, setGroup] = useState({ name: "", imageUrl: "" });
  const [allGroups, setAllGroups] = useState([]);
  const [quiz, setQuiz] = useState({});
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDisconnected, setIsDisconnected] = useState(false);

  const wsManager = useRef(null);

  useEffect(() => {
    if (groupName !== "") {
      const fetchGroups = async () => {
        const response = await useAxios.get("/group");
        setAllGroups(response.data);
      };

      initializeWebSocket();
      fetchGroups();
    }

    return () => {
      if (wsManager.current) {
        wsManager.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (characterName !== "") {
      const saveGroup = () => {
        if (!wsManager.current) {
          initializeWebSocket(() => {
            sendGroupCreateMessage();
          });
        } else {
          sendGroupCreateMessage();
        }
      };

      const sendGroupCreateMessage = () => {
        const groupData = {
          ...group,
          imageUrl: characterName,
        };

        console.log(groupData);

        wsManager.current.send({
          sender: CLIENT_ROLE,
          type: GROUP_CREATION,
          payload: JSON.stringify(groupData),
        });
        console.log(groupData);

      };

      saveGroup();
    }
  }, [characterName]);

  const initializeWebSocket = (onConnected) => {
    setLoading(true);
    setIsDisconnected(false);

    if (wsManager.current) {
      console.log("Auto disconnect");
      wsManager.current.disconnect();
    }

    wsManager.current = new WebSocketManager("/socket");
    wsManager.current.connect();

    wsManager.current.addMessageHandler((message) => {
      const parsedPayload =
        message.payload !== "" ? JSON.parse(message.payload) : "";

      switch (message.type) {
        case GROUP_CREATED:
          handleGroupCreated(message);
          break;
        case QUESTION:
          setQuiz(parsedPayload);
          setShowQuiz(true);
          break;
        case QUESTION_CANCEL:
          setAllGroups(parsedPayload);
          setShowQuiz(false);
          setQuizStarted(false);
          break;
        case QUIZ_START:
          setQuizStarted(true);
          break;
      }
    });

    wsManager.current.addConnectionListener("open", () => {
      console.log("WebSocket connected");
      setIsDisconnected(false);
      setLoading(false);
      if (onConnected) onConnected();
    });

    wsManager.current.addConnectionListener("close", () => {
      console.warn("WebSocket disconnected. Trying to reconnect...");
      setIsDisconnected(true);
      setLoading(false);
      retryConnection();
    });

    wsManager.current.addConnectionListener("error", (err) => {
      console.error("WebSocket error:", err);
      setIsDisconnected(true);
      setLoading(true);
      retryConnection();
    });
  };

  const retryConnection = () => {
    setTimeout(() => {
      if (!wsManager.current?.isConnected?.()) {
        initializeWebSocket();
      }
    }, 3000);
  };

  const handleGroupCreated = (message) => {
    Cookies.set("name", groupName, { expires: 1 });
    setAllGroups(JSON.parse(message.payload) || []);
    setShowCharacters(false);
  };

  // useEffect(() => {
  //   if (groupName && !wsManager.current) {
  //     initializeWebSocket();
  //   }
  // }, [groupName]);

  const handleSubmit = (groupName) => {
    setGroup({ name: groupName, imageUrl: "" });
    setGroupName(groupName);
    setShowForm(false);
    setShowCharacters(true);
  };

  const onAnswerSelection = (isCorrect) => {
    wsManager.current.send({
      sender: groupName,
      type: ANSWER,
      payload: JSON.stringify({
        quiz,
        isCorrect,
      }),
    });
  };

  return (
    <div className="client">
      {(isDisconnected || loading) && <div className="loader"></div>}
      {loading && <div className="loader"></div>}
      {showForm && groupName === "" && (
        <ClientGroupForm onSubmit={handleSubmit} />
      )}
      {showCharacters && (
        <CharactersList
          characterName={characterName}
          setCharacterName={setCharacterName}
        />
      )}
      {groupName !== "" && !showQuiz && (
        <GroupsList groups={allGroups} adminMode={false} />
      )}
      {showQuiz && (
        <ClientQuestion
          quiz={quiz}
          onAnswerSelection={onAnswerSelection}
          quizStarted={quizStarted}
        />
      )}
    </div>
  );
};

export default Client;
