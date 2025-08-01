import { useEffect, useRef, useState } from "react";
import WebSocketManager from "../components/hooks/WebSocketManager";
import GroupsList from "../components/lists/GroupsList";
import useAxios from "../components/hooks/UseAxios";
import "../style/pages/Groups.scss";
import Navbar from "../components/navigation/Navbar";
import ShowConnectionLinkPageBtn from "../components/uiComponents/ShowConnectionLinkPageBtn";
import { GROUP_CREATED, SHOW_INSTRUCTION_IMAGE, SHOW_INSTRUCTIONS } from "../Constant";

const Groups = () => {
  const [allGroups, setAllGroups] = useState([]);
  const [, setError] = useState(null);
  const [, setIsConnected] = useState(false);
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
      const response = await useAxios.get("/group");
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
          case GROUP_CREATED:
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

    wsManager.current.addConnectionListener("error", () => {
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
        type: SHOW_INSTRUCTIONS,
        payload: !showInstructions,
      });
    }, 1000);
  };

  const handleGroupEdit = async (group) => {
    const response = await useAxios.put("/group", group);
    setAllGroups(response.data);
  };

  const handleGroupDelete = async (groupId) => {
    const response = await useAxios.delete(`/group?id=${groupId}`);
    setAllGroups(response.data);
  };

  const handleClearAllPoints = async () => {
    const response = await useAxios.put("/group/clear");
    setAllGroups(response.data);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file || !broadcastChannel) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Image = e.target.result;

      broadcastChannel.postMessage({
        type: SHOW_INSTRUCTION_IMAGE,
        payload: {
          name: file.name,
          imageData: base64Image,
        },
      });
    };

    reader.readAsDataURL(file);
  };

  return (
    <>
      <Navbar />
      <div className="admin-groups-container">
        <ShowConnectionLinkPageBtn onClick={handleClick} />

        <div className="admin-groups-header">
          <h2>Groups Management</h2>
        </div>
        <div className="editors">
          <button className="clear-all" onClick={handleClearAllPoints}>
            Clear Points
          </button>

          <div className="image-upload-section">
            <label htmlFor="imageUpload" className="upload-label">
              Connection QR-code
            </label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        </div>

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
