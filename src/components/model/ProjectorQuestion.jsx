import { useEffect, useState, useRef } from "react";
import "../../style/model/ProjectorQuestion.scss";
import QuestionLoader from "../uiComponents/QuestionLoader";
import countdown30v1 from "/sounds/countdown30v1.mp3";
import countdown30v2 from "/sounds/countdown30v2.mp3";
import countdown20v1 from "/sounds/countdown20v1.mp3";
import countdown20v2 from "/sounds/countdown20v2.mp3";
import countdown10v1 from "/sounds/countdown10v1.mp3";
import countdown10v2 from "/sounds/countdown10v2.mp3";
import answerSound from "/sounds/answer.mp3";

const ProjectorQuestion = ({ quiz }) => {
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(quiz.type === "A" ? 30 : quiz.type === "B" ? 20 : 10);
  const [showResults, setShowResults] = useState(false);
  const [showQuestionIntro, setShowQuestionIntro] = useState(true);
  const countdownAudioRef = useRef(null);
  const answerAudioRef = useRef(null);
  const [selectedVersion, setSelectedVersion] = useState(null);

  useEffect(() => {
    setSelectedVersion(Math.random() < 0.5 ? 'v1' : 'v2');
  }, []);

  const getSoundFile = () => {
    if (!selectedVersion) return countdown30v1;
    
    switch(quiz.type) {
      case 'A': 
        return selectedVersion === 'v1' ? countdown30v1 : countdown30v2;
      case 'B': 
        return selectedVersion === 'v1' ? countdown20v1 : countdown20v2;
      case 'C': 
        return selectedVersion === 'v1' ? countdown10v1 : countdown10v2;
      default: 
        return countdown30v1;
    }
  };

  useEffect(() => {
    if (selectedVersion) {
      const soundFile = getSoundFile();
      countdownAudioRef.current = new Audio(soundFile);
      countdownAudioRef.current.loop = true;
      countdownAudioRef.current.volume = 1;

      answerAudioRef.current = new Audio(answerSound);
      answerAudioRef.current.volume = 1;

      return () => {
        if (countdownAudioRef.current) {
          countdownAudioRef.current.pause();
          countdownAudioRef.current = null;
        }
        if (answerAudioRef.current) {
          answerAudioRef.current.pause();
          answerAudioRef.current = null;
        }
      };
    }
  }, [quiz.type, selectedVersion]);

  useEffect(() => {
    if (!isLoading) {
      const introTimer = setTimeout(() => {
        setShowQuestionIntro(false);
      }, 3000);

      return () => clearTimeout(introTimer);
    }
  }, [isLoading]);

  useEffect(() => {
    if (countdownAudioRef.current && !showQuestionIntro) {
      if (!isLoading && !showResults) {
        countdownAudioRef.current.play().catch(e => {
          console.log("Countdown audio play failed:", e);
        });
      } else {
        countdownAudioRef.current.pause();
        if (showResults) {
          countdownAudioRef.current.currentTime = 0;
        }
      }
    }
  }, [isLoading, showResults, showQuestionIntro]);

  useEffect(() => {
    if (showResults && answerAudioRef.current) {
      if (countdownAudioRef.current) {
        countdownAudioRef.current.pause();
        countdownAudioRef.current.currentTime = 0;
      }
      
      answerAudioRef.current.currentTime = 0;
      answerAudioRef.current.play().catch(e => {
        console.log("Answer audio play failed:", e);
      });
    }
  }, [showResults]);

  useEffect(() => {
    const splitedAnswers = quiz.answer.split(", ");
    setAnswers(splitedAnswers);

    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(loadingTimer);
  }, [quiz.answer]);

  useEffect(() => {
    if (!isLoading && !showQuestionIntro) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setShowResults(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLoading, showQuestionIntro]);

  const isCorrectAnswer = (answer) => {
    return answer.includes("**");
  };

  const cleanAnswerText = (answer) => {
    return answer.replace(/\*\*/g, "");
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
    <div className="projector-question">
      {!showResults && (
        <div className="timer-container">
          <div className="timer-circle">
            <span className="timer-text">{timeLeft}</span>
          </div>
        </div>
      )}

      <h1>{quiz.question}</h1>
      <div className="projector-answers-grid">
        {answers.map((answer, index) => {
          const correct = isCorrectAnswer(answer);
          const cleanedAnswer = cleanAnswerText(answer);

          return (
            <div
              key={index}
              className={`projector-answer-option ${
                correct ? "projector-correct-answer" : ""
              } ${showResults ? "show-result" : ""}`}
              data-correct={correct}
            >
              {cleanedAnswer}
              {showResults && (
                <span className="result-indicator">{correct ? "✓" : "✗"}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectorQuestion;