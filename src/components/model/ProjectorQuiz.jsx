import { useState } from "react";
import "../../style/model/ProjectorQuiz.scss";

const ProjectorQuiz = ({ quiz, index }) => {
  const [isEnabled, setIsEnabled] = useState(quiz.enabled !== 1);

  return (
    <div className={`projector-quiz ${!isEnabled ? "disabled" : ""}`}>
      {!isEnabled && <p className="disabled-x">X</p>}
      <div className="quiz-label">
        <span className="quiz-index">
          {quiz.type}.{index + 1}
        </span>
        <span className="quiz-points">{quiz.points}</span>
      </div>
    </div>
  );
};

export default ProjectorQuiz;
