import { useState, useEffect } from "react";
import '../../style/forms/QuizForm.scss';

const QuizEditForm = ({ 
  quiz, 
  types,
  gameId,
  categoryId, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    gameId,
    categoryId,
    type: "A",
    question: "",
    answer: "",
    mediaUrl: "",
    points: "",
    hint: "",
  });

  useEffect(() => {
    if (quiz) {
      setFormData({
        gameId,
        categoryId: quiz.categoryId || categoryId,
        type: quiz.type || "",
        question: quiz.question || "",
        answer: quiz.answer || "",
        mediaUrl: quiz.mediaUrl || "",
        points: quiz.points || "",
        hint: quiz.hint || "",
      });
    }
  }, [quiz, categoryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "points" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: quiz.id
    });
  };

  return (
    <form className="quiz-form" onSubmit={handleSubmit}>
      <label>
        Difficulty:
        <select
          name="type"
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
          placeholder="https://example.com/image.jpg"
        />
      </label>

      <label>
        Points:
        <input
          type="number"
          name="points"
          min="0"
          step="0.5"
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
          placeholder="Optional hint for players"
        />
      </label>

      <div className="form-actions">
        <button type="submit" className="submit-btn">
          Update Quiz
        </button>
        <button 
          type="button" 
          className="cancel-btn"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default QuizEditForm;