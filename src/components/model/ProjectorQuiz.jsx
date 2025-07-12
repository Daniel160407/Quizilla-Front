import { useState } from "react";
import "../../style/model/DashboardQuiz.scss";

const ProjectorQuiz = ({ quiz, index }) => {
  const [isEnabled, setIsEnabled] = useState(quiz.enabled !== 1);

  return (
    <div className={`dashboard-quiz ${!isEnabled ? "disabled" : ""}`}>
      <p>
        {quiz.type}.{index + 1}
      </p>
    </div>
  );
};

export default ProjectorQuiz;
