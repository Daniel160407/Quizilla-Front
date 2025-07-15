import { useEffect, useState } from "react";
import "../../style/model/ClientQuestion.scss";
import QuestionLoader from "../uiComponents/QuestionLoader";

const ClientQuestion = ({ quiz, onAnswerSelection, quizStarted }) => {
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    if (!quiz?.answer) return;

    const splitedAnswers = quiz.answer.split(", ");
    setAnswers(splitedAnswers);
    setIsLoading(true);
    setSelectedAnswer(null);
  }, [quiz]);

  useEffect(() => {
    if (quizStarted) {
      setIsLoading(false);
    }
  }, [quizStarted]);

  const cleanAnswerText = (answer) => {
    return answer.replace(/\*\*/g, "");
  };

  const handleAnswerClick = (answer, index) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    const isCorrect = answer.includes("**");
    onAnswerSelection(isCorrect);
  };

  if (isLoading) {
    return <QuestionLoader />;
  }

  return (
    <div className="client-question">
      <div className="client-answers-grid">
        {answers.map((answer, index) => {
          const isSelected = selectedAnswer === index;
          const isNotSelected = selectedAnswer !== null && !isSelected;
          const answerLetter = String.fromCharCode(65 + index);

          return (
            <div
              key={index}
              className={`client-answer-option 
                ${isSelected ? "client-selected-answer" : ""}
                ${isNotSelected ? "client-not-selected" : ""}
                answer-${index}
              `}
              onClick={() => handleAnswerClick(answer, index)}
            >
              <div className="answer-letter">{answerLetter}</div>
              {isSelected && <span className="selection-marker">✓</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClientQuestion;