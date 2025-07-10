import { useEffect, useState } from "react";
import "../../style/model/ClientQuestion.scss";
import QuestionLoader from "../uiComponents/QuestionLoader";

const ClientQuestion = ({ quiz, onAnswerSelection }) => {
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showQuestionIntro, setShowQuestionIntro] = useState(true);

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
      const introTimer = setTimeout(() => {
        setShowQuestionIntro(false);
      }, 3000);

      return () => clearTimeout(introTimer);
    }
  }, [isLoading]);

  const isCorrectAnswer = (answer) => {
    return answer.includes("**");
  };

  const cleanAnswerText = (answer) => {
    return answer.replace(/\*\*/g, "");
  };

  const handleAnswerClick = (answer, index) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections
    
    const correct = isCorrectAnswer(answer);
    setSelectedAnswer(index);
    onAnswerSelection(correct); // Call the callback with true/false
    setShowResults(true);
  };

  if (isLoading) {
    return <QuestionLoader />;
  }

  if (showQuestionIntro) {
    return (
      <div className="question-intro">
        <div className="question-intro-content">
          <h1>{quiz.question}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="client-question">
      <h1>{quiz.question}</h1>
      <div className="client-answers-grid">
        {answers.map((answer, index) => {
          const correct = isCorrectAnswer(answer);
          const cleanedAnswer = cleanAnswerText(answer);
          const isSelected = selectedAnswer === index;

          return (
            <div
              key={index}
              className={`client-answer-option 
                ${correct ? "client-correct-answer" : ""}
                ${isSelected ? "client-selected-answer" : ""}
                ${showResults ? "show-result" : ""}`}
              onClick={() => handleAnswerClick(answer, index)}
              data-correct={correct}
            >
              {cleanedAnswer}
              {showResults && isSelected && (
                <span className="result-indicator">
                  {correct ? "✓" : "✗"}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClientQuestion;