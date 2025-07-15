import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import "../../style/model/Question.scss";
import QuestionLoader from "../uiComponents/QuestionLoader";

const Question = ({ quiz, onBack }) => {
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(
    quiz.type === "C" ? 30 : quiz.type === "B" ? 20 : 10
  );

  useEffect(() => {
    const splitedAnswers = quiz.answer.split(", ");
    setAnswers(splitedAnswers);

    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(loadingTimer);
  }, [quiz.answer]);

  useEffect(() => {
    if (!isLoading) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLoading]);

  const isCorrectAnswer = (answer) => {
    return answer.includes("**");
  };

  const cleanAnswerText = (answer) => {
    return answer.replace(/\*\*/g, "");
  };

  if (isLoading) {
    return <QuestionLoader />;
  }

  return (
    <div className="question">
      <button className="back-button" onClick={onBack}>
        <FaArrowLeft className="back-icon" />
      </button>
      <div className="timer-container">
        <div className="timer-circle">
          <span className="timer-text">{timeLeft}</span>
        </div>
      </div>
      <h1>{quiz.question}</h1>
      <div className="answers-grid">
        {answers.map((answer, index) => {
          const correct = isCorrectAnswer(answer);
          return (
            <div
              key={index}
              className={`answer-option ${correct ? "correct-answer" : ""}`}
              data-correct={correct}
            >
              {cleanAnswerText(answer)}
              {correct && <span className="correct-badge">Correct</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Question;
