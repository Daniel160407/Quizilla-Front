import { useState } from "react";
import { FaTimes } from "react-icons/fa";

const CategoryEditForm = ({ category, onSubmit, onCancel }) => {
  const [name, setName] = useState(category.name);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({
        id: category.id,
        name,
      });
    }
  };

  return (
    <form className="category-form" onSubmit={handleSubmit}>
      <button
        type="button"
        className="cancel-btn"
        onClick={onCancel}
        aria-label="Cancel editing"
      >
        <FaTimes />
      </button>
      <label>
        Category Name:
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />
      </label>
      <button type="submit">Save</button>
    </form>
  );
};

export default CategoryEditForm;
