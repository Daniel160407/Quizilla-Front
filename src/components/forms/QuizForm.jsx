import { useState } from "react";
import '../../style/forms/QuizForm.scss';

const QuizForm = ({ types, categoryId, onSubmit }) => {
  const [formData, setFormData] = useState({
    categoryId,
    type: "A",
    question: "",
    answer: "",
    mediaUrl: "",
    points: "",
    hint: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "points" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="quiz-form" onSubmit={handleSubmit}>
      <label>
        Difficulty:
        <select
          name="type"
          className="typeSelector"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value={'A'}>A</option>
          <option value={'B'}>B</option>
          <option value={'C'}>C</option>
        </select>
      </label>

      <label>
        Question:
        <input
          type="text"
          name="question"
          value={formData.question}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Answer:
        <input
          type="text"
          name="answer"
          value={formData.answer}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Media URL:
        <input
          type="url"
          name="mediaUrl"
          value={formData.mediaUrl}
          onChange={handleChange}
        />
      </label>

      <label>
        Points:
        <input
          type="number"
          name="points"
          step="0.1"
          value={formData.points}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Hint:
        <input
          type="text"
          name="hint"
          value={formData.hint}
          onChange={handleChange}
        />
      </label>

      <button type="submit">Submit Quiz</button>
    </form>
  );
};

export default QuizForm;
