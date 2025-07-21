import React, { useState, useEffect, useRef } from "react";
import { FaSave, FaTrash, FaTimes } from "react-icons/fa";
import "../../style/forms/GroupForm.scss";

const GroupForm = ({ group, onSave, onCancel, onDelete }) => {
  const [formData, setFormData] = useState({
    name: group.name,
    points: group.points,
    imageUrl: group.imageUrl || "",
  });
  const [currentImage, setCurrentImage] = useState(group.imageUrl || "");
  const [failedImages, setFailedImages] = useState(new Set());
  const [debouncedImageUrl, setDebouncedImageUrl] = useState(
    group.imageUrl || ""
  );
  const debounceTimer = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "points" ? parseFloat(value) || 0 : value,
    }));

    if (name === "imageUrl") {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        setDebouncedImageUrl(value);
      }, 1000);
    }
  };

  useEffect(() => {
    if (
      debouncedImageUrl &&
      debouncedImageUrl !== currentImage &&
      !failedImages.has(debouncedImageUrl)
    ) {
      setCurrentImage(debouncedImageUrl);
    }
  }, [debouncedImageUrl, failedImages]);

  const handleImageError = (e) => {
    setFailedImages((prev) => new Set(prev).add(currentImage));
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...group, ...formData });
  };

  return (
    <div className={`group-card editing`}>
      <div className="group-image-container">
        <img
          src={`/images/characters/${currentImage}.png`}
          alt={formData.name}
          className="group-image"
          onError={handleImageError}
        />
      </div>
      <form onSubmit={handleSubmit} className="group-info">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="group-name-input"
          placeholder="Group name"
          required
        />
        <input
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          className="group-image-input"
          placeholder="Image filename (without extension)"
        />
        <div className="group-points">
          <input
            type="text"
            name="points"
            value={formData.points}
            onChange={handleChange}
            className="points-input"
            placeholder="Points"
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
