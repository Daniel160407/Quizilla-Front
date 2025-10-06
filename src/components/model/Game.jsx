import { FaEdit, FaTrash } from "react-icons/fa";
import { useState } from "react";
import "../../style/model/Game.scss";
import GameEditForm from "../forms/GameEditForm";

const Game = ({ game, onClick, index, onDelete, onUpdate }) => {
  const [showEditForm, setShowEditForm] = useState(false);

  const handleEditClick = (e) => {
    e.stopPropagation();
    setShowEditForm(true);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(game.id);
  };

  const handleSubmitEdit = async (updatedGame) => {
    await onUpdate(updatedGame);
    setShowEditForm(false);
  };

  return (
    <>
      <div
        className={`game game-color-${index % 5} fade-in`}
        style={{ animationDelay: `${index * 0.07}s` }}
        onClick={() => onClick(game.id)}
      >
        <div className="game-content">
          <h1>{game.name}</h1>
          <p>{game.dateCreated}</p>
        </div>
        <div className="game-actions">
          <button className="game-btn edit-btn" onClick={handleEditClick}>
            <FaEdit />
          </button>
          <button className="game-btn delete-btn" onClick={handleDeleteClick}>
            <FaTrash />
          </button>
        </div>
      </div>

      {showEditForm && (
        <GameEditForm
          game={game}
          onClose={() => setShowEditForm(false)}
          onSubmit={handleSubmitEdit}
        />
      )}
    </>
  );
};

export default Game;
