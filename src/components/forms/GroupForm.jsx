import React, { useState } from "react";
import { FaSave, FaTrash, FaTimes } from "react-icons/fa";
import "../../style/forms/GroupForm.scss";

const GroupForm = ({ group, onSave, onCancel, onDelete }) => {
  const [formData, setFormData] = useState({
    name: group.name,
    points: group.points,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "points" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...group, ...formData });
  };

  return (
    <div className={`group-card editing`}>
      <div className="group-image-container">
        <img
          src={`/images/characters/${group.imageUrl}.png`}
          alt={formData.name}
          className="group-image"
        />
      </div>
      <form onSubmit={handleSubmit} className="group-info">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="group-name-input"
          required
        />
        <div className="group-points">
          <input
            type="text"
            name="points"
            value={formData.points}
            onChange={handleChange}
            className="points-input"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="save-btn">
            <FaSave /> Save
          </button>
          <button type="button" className="cancel-btn" onClick={onCancel}>
            <FaTimes /> Cancel
          </button>
          <button
            type="button"
            className="delete-btn"
            onClick={() => onDelete(group.id)}
          >
            <FaTrash /> Delete
          </button>
        </div>
      </form>
    </div>
  );
};

export default GroupForm;
