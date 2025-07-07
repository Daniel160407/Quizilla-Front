import { FaEdit, FaTrash } from "react-icons/fa";
import "../../style/model/Category.scss";
import { useState } from "react";
import CategoryEditForm from "../forms/CategoryEditForm";

const Category = ({ category, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditSubmit = (data) => {
    onEdit(data);
    setIsEditing(false);
  };

  return (
    <div className="category-card">
      {isEditing ? (
        <CategoryEditForm
          category={category}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <div className="category-content">
            <h3 className="category-name">{category.name}</h3>
            <p className="category-id">ID: {category.id}</p>
          </div>
          <div className="category-actions">
            <button
              className="edit-btn"
              onClick={() => setIsEditing(true)}
              aria-label="Edit category"
            >
              <FaEdit />
            </button>
            <button
              className="delete-btn"
              onClick={() => onDelete(category.id)}
              aria-label="Delete category"
            >
              <FaTrash />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Category;
