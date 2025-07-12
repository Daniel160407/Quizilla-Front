import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import ClientGroupForm from "../forms/ClientGroupForm";
import CharactersList from "../lists/CharactersList";
import "../../style/pages/Client.scss";
import GroupsList from "../lists/GroupsList";
import WebSocketManager from "../hooks/WebSocketManager";
import ClientQuestion from "../model/ClientQuestion";
import useAxios from "../hooks/UseAxios";

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

  const wsManager = useRef(null);

  useEffect(() => {
    if (groupName !== "") {
      const fetchGroups = async () => {
        const response = await useAxios("/group", "get");
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

        wsManager.current.send({
          sender: "player",
          type: "GROUP_CREATION",
          payload: JSON.stringify(groupData),
        });
      };

      saveGroup();
    }
  }, [characterName]);

  const initializeWebSocket = (onConnected) => {
    if (wsManager.current) {
      wsManager.current.disconnect();
    }

    wsManager.current = new WebSocketManager("/socket");
    wsManager.current.connect();

    wsManager.current.addMessageHandler((message) => {
      const parsedPayload = message.payload !== '' ? JSON.parse(message.payload) : '';
      switch (message.type) {
        case "GROUP_CREATED":
          handleGroupCreated(message);
          break;
        case "QUESTION":
          console.log(parsedPayload);
          setQuiz(parsedPayload);
          setShowQuiz(true);
          break;
        case "QUESTION_CANCEL":
          setAllGroups(parsedPayload);
          setShowQuiz(false);
          setQuizStarted(false);
          break;
        case "QUIZ_START":
          setQuizStarted(true);
          break;
      }
    });

    wsManager.current.addConnectionListener("open", () => {
      console.log("WebSocket connected");
      if (onConnected) onConnected();
    });
  };

  const handleGroupCreated = (message) => {
    Cookies.set("name", groupName, { expires: 1 });
    setAllGroups(JSON.parse(message.payload) || []);
    setShowCharacters(false);
  };

  useEffect(() => {
    if (groupName && !wsManager.current) {
      initializeWebSocket();
    }
  }, [groupName]);

  const handleSubmit = (groupName) => {
    setGroup({ name: groupName, imageUrl: "" });
    setGroupName(groupName);
    setShowForm(false);
    setShowCharacters(true);
  };

  const onAnswerSelection = (isCorrect) => {
    wsManager.current.send({
      sender: groupName,
      type: "ANSWER",
      payload: JSON.stringify({
        quiz,
        isCorrect,
      }),
    });
  };

  return (
    <div className="client">
      {showForm && groupName === "" && (
        <ClientGroupForm onSubmit={handleSubmit} />
      )}
      {showCharacters && (
        <CharactersList
          characterName={characterName}
          setCharacterName={setCharacterName}
        />
      )}
      {groupName !== "" && !showQuiz && <GroupsList groups={allGroups} />}
      {showQuiz && (
        <ClientQuestion quiz={quiz} onAnswerSelection={onAnswerSelection} quizStarted={quizStarted} />
      )}
    </div>
  );
};

export default Client;
