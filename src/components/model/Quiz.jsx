import { FaEdit, FaTrash } from "react-icons/fa";
import "../../style/model/Quiz.scss";
import QuizEditForm from "../forms/QuizEditForm";
import { useState } from "react";

const Quiz = ({ quiz, index, onEdit, onDelete, types }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const hasRightAnswer = quiz.answer.includes("**");

  const handleEditSubmit = (updatedQuiz) => {
    onEdit(updatedQuiz);
    setShowEditForm(false);
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
  };

  return (
    <>
      {showEditForm ? (
        <QuizEditForm
          quiz={quiz}
          types={types}
          categoryId={quiz.categoryId}
          onSubmit={handleEditSubmit}
          onCancel={handleCancelEdit}
        />
      ) : (
        <div
          className="quiz"
          data-type={quiz.type.toLowerCase().replace(/\s+/g, "")}
          data-no-answer={!hasRightAnswer}
        >
          <>
            <p>
              <span className={!hasRightAnswer ? "no-answer" : ""}>
                {quiz.type}.{index + 1}
              </span>
              <span>{quiz.points} pts</span>
            </p>
            <div className="quiz-actions">
              <button
                className="edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEditForm(true);
                }}
                aria-label="Edit quiz"
              >
                <FaEdit />
              </button>
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(quiz.id);
                }}
                aria-label="Delete quiz"
              >
                <FaTrash />
              </button>
            </div>
          </>
        </div>
      )}
    </>
  );
};

export default Quiz;
