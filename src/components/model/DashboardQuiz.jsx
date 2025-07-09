import { useState } from "react";
import "../../style/model/DashboardQuiz.scss";
import useAxios from "../hooks/UseAxios";

const DashboardQuiz = ({ quiz, index, onClick }) => {
  const [isEnabled, setIsEnabled] = useState(quiz.enabled !== 1);

  const handleToggle = (e) => {
    e.stopPropagation();
    const newState = !isEnabled;
    setIsEnabled(newState);

    useAxios(
      `/quiz/enable?id=${quiz.id}&enable=${newState ? true : false}`,
      "put"
    );
  };

  return (
    <div
      className={`dashboard-quiz ${!isEnabled ? "disabled" : ""}`}
      onClick={isEnabled ? () => onClick(quiz) : undefined}
    >
      <p>
        {quiz.type}.{index + 1}
      </p>

      <button
        className={`enable-toggle ${isEnabled ? "enabled" : "disabled"}`}
        onClick={handleToggle}
        aria-label={isEnabled ? "Disable quiz" : "Enable quiz"}
      >
        <span className="toggle-track">
          <span className="toggle-thumb" />
        </span>
        <span className="toggle-label">{isEnabled ? "ON" : "OFF"}</span>
      </button>
    </div>
  );
};

export default DashboardQuiz;
