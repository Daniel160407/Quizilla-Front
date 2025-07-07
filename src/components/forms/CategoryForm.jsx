import { useState } from "react";
import '../../style/forms/CategoryForm.scss';

const CategoryForm = ({ onSubmit }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({ name });
      setName("");
    }
  };

  return (
    <form className="category-form" onSubmit={handleSubmit}>
      <label>
        Category Name:
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <button type="submit">Create Category</button>
    </form>
  );
};

export default CategoryForm;
