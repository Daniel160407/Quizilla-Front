import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../../style/lists/GroupsList.scss";
import GroupForm from "../forms/GroupForm";

const GroupsList = ({
  groups,
  mode,
  onEditGroup,
  onDeleteGroup,
  adminMode,
}) => {
  const [editingId, setEditingId] = useState(null);
  const maxPoints = Math.max(...groups.map((group) => group.points || 0));

  const handleEdit = (group) => {
    onEditGroup(group);
    setEditingId(null);
  };

  const handleDelete = (groupId) => {
    onDeleteGroup(groupId);
    setEditingId(null);
  };

  const groupOutlineColor = (group) => {
    if (group.correctAnswer === undefined) {
      return "";
    }

    if (group.correctAnswer === true) {
      return "correct-answer";
    } else if (group.correctAnswer === false) {
      return "incorrect-answer";
    }
  }

  return (
    <div className={`groups-list dark ${mode}`}>
      {groups.map((group) =>
        editingId === group.id ? (
          <GroupForm
            key={group.id}
            group={group}
            onSave={handleEdit}
            onCancel={() => setEditingId(null)}
            onDelete={handleDelete}
          />
        ) : (
          <div
            key={group.id}
            className={`group-card ${
              group.points === maxPoints && maxPoints > 0 ? "leader" : ""
            } ${groupOutlineColor(group)}`}
          >
            <div className="group-image-container">
              <img
                src={`/images/characters/${group.imageUrl}.png`}
                alt={group.name}
                className="group-image"
              />
            </div>
            <div className="group-info">
              <h3 className="group-name">{group.name}</h3>
              <div className="group-points">
                <span className="points-value">{group.points || 0}</span>
                <span className="points-label">points</span>
              </div>
              {adminMode && (
                <div className="group-actions">
                  <button
                    className="edit-btn"
                    onClick={() => setEditingId(group.id)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(group.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default GroupsList;
