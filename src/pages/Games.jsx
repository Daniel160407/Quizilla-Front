import { useEffect, useState } from "react";
import useAxios from "../components/hooks/UseAxios";
import Game from "../components/model/Game";
import "../style/pages/Games.scss";
import AddGameBtn from "../components/uiComponents/AddGameBtn";
import GameForm from "../components/forms/GameForm";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navigation/Navbar";

const Games = () => {
  const [games, setGames] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await useAxios.get("/game");
        setGames(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load games. Please try again later.");
        setLoading(false);
        console.error("Error fetching games:", err);
      }
    };
    fetchGames();
  }, []);

  const handleAddGameBtnClick = () => {
    setShowForm(true);
  };

  const handleGameSubmit = async (gameData) => {
    try {
      const updatedList = await useAxios.post("/game", gameData);
      setGames(updatedList.data);
      setShowForm(false);
      setName("");
      setError(null);
    } catch (err) {
      setError("Failed to add game. Please try again.");
      console.error("Error adding game:", err);
    }
  };

  const handleGameClick = (gameId) => {
    Cookies.set("gameId", gameId, { expires: 1 });
    navigate("/dashboard");
  };

  const handleUpdateGame = async (updatedGame) => {
    try {
      const response = await useAxios.put("/game", updatedGame);
      setGames(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to update game. Please try again.");
      console.error("Error updating game:", err);
    }
  };

  const handleDeleteGame = async (gameId) => {
    try {
      const response = await useAxios.delete(`/game?id=${gameId}`);
      setGames(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to delete game. Please try again.");
      console.error("Error deleting game:", err);
    }
  };

  return (
    <>
    <Navbar />
    <div className="games">
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">Loading games...</div>
      ) : (
        <>
          {games.length === 0 && !showForm ? (
            <div className="no-games-message">
              No games found. Create your first game!
            </div>
          ) : (
            games.map((game, index) => (
              <Game
                key={index}
                game={game}
                index={index}
                onClick={handleGameClick}
                onDelete={handleDeleteGame}
                onUpdate={handleUpdateGame}
              />
            ))
          )}
          <AddGameBtn onClick={handleAddGameBtnClick} />

          {showForm && (
            <GameForm
              name={name}
              setName={setName}
              onSubmit={handleGameSubmit}
              onCancel={() => setShowForm(false)}
            />
          )}
        </>
      )}
    </div>
    </>
  );
};

export default Games;
