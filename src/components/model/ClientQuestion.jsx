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
  }, [quiz]);

  useEffect(() => {
    if(quizStarted) {
      setIsLoading(false);
    }
  }, [quizStarted]);

  const isCorrectAnswer = (answer) => {
    return answer.includes("**");
  };

  const cleanAnswerText = (answer) => {
    return answer.replace(/\*\*/g, "");
  };

  const handleAnswerClick = (answer, index) => {
    if (selectedAnswer !== null) return;

    const correct = isCorrectAnswer(answer);
    setSelectedAnswer(index);
    onAnswerSelection(correct);
  };

  if (isLoading) {
    return <QuestionLoader />;
  }

  return (
    <div className="client-question">
      <div className="client-answers-grid">
        {answers.map((answer, index) => {
          const cleanedAnswer = cleanAnswerText(answer);
          const isSelected = selectedAnswer === index;

          return (
            <div
              key={index}
              className={`client-answer-option 
                ${isSelected ? "client-selected-answer" : ""}
              `}
              onClick={() => handleAnswerClick(answer, index)}
            >
              {cleanedAnswer}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClientQuestion;
