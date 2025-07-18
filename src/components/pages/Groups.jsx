import { use, useEffect, useRef, useState } from "react";
import WebSocketManager from "../hooks/WebSocketManager";
import GroupsList from "../lists/GroupsList";
import useAxios from "../hooks/UseAxios";
import "../../style/pages/Groups.scss";
import Navbar from "../navigation/Navbar";
import ShowConnectionLinkPageBtn from "../uiComponents/ShowConnectionLinkPageBtn";

const Groups = () => {
  const [allGroups, setAllGroups] = useState([]);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [broadcastChannel, setBroadcastChannel] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [loading, setLoading] = useState(false);

  const wsManager = useRef(null);

  useEffect(() => {
    fetchGroups();
    const channel = new BroadcastChannel("quiz_channel");
    setBroadcastChannel(channel);

    return () => {
      channel.close();
    };
  }, []);

  useEffect(() => {
    if (!wsManager.current) {
      initializeWebSocket();
    }

    return () => {
      if (wsManager.current) {
        wsManager.current.disconnect();
      }
    };
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await useAxios("/group", "get");
      setAllGroups(response.data);
    } catch (err) {
      console.error("Failed to fetch groups", err);
    }
  };

  const initializeWebSocket = () => {
    setLoading(true);
    wsManager.current = new WebSocketManager("/socket");

    wsManager.current.connect();

    wsManager.current.addMessageHandler((message) => {
      try {
        switch (message.type) {
          case "GROUP_CREATED":
            handleGroupCreated(JSON.parse(message.payload));
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
      setLoading(false);
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

  const handleGroupCreated = (groups) => {
    setAllGroups(groups);
  };

  const handleClick = () => {
    setShowInstructions(!showInstructions);

    setTimeout(() => {
      broadcastChannel.postMessage({
        type: "SHOW_INSTRUCTIONS",
        payload: !showInstructions,
      });
    }, 1000);
  };

  const handleGroupEdit = async (group) => {
    const response = await useAxios("/group", "put", group);
    setAllGroups(response.data);
  };

  const handleGroupDelete = async (groupId) => {
    const response = await useAxios(`/group?id=${groupId}`, "delete");
    setAllGroups(response.data);
  };

  const handleClearAllPoints = async () => {
    const response = await useAxios("/group/clear", "put");
    setAllGroups(response.data);
  };

  return (
    <>
      <Navbar />
      <div className="admin-groups-container">
        <ShowConnectionLinkPageBtn onClick={handleClick} />

        <div className="admin-groups-header">
          <h2>Groups Management</h2>
        </div>
        <button className="clear-all" onClick={handleClearAllPoints}>
          Clear Points
        </button>

        <div className="admin-groups-content">
          <div className="groups-list-section">
            <GroupsList
              groups={allGroups}
              onEditGroup={handleGroupEdit}
              onDeleteGroup={handleGroupDelete}
              adminMode={true}
            />
            {loading && <div className="loader"></div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Groups;
