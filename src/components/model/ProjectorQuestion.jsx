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
import GroupsAnsweredList from "../lists/GroupsAnsweredList";
import QuizMediaPlayer from "../uiComponents/QuizMediaPlayer";

const ProjectorQuestion = ({
  quiz,
  playersAnswered,
  onTimeUp,
  quizStarted,
}) => {
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const baseTime = quiz.type === "C" ? 30 : quiz.type === "B" ? 20 : 10;
  const [timeLeft, setTimeLeft] = useState(baseTime);
  const [showResults, setShowResults] = useState(false);
  const [showQuestionIntro, setShowQuestionIntro] = useState(true);
  const countdownAudioRef = useRef(null);
  const answerAudioRef = useRef(null);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const timerRef = useRef(null);
  const hasMedia = !!quiz.mediaUrl;

  useEffect(() => {
    setSelectedVersion(Math.random() < 0.5 ? "v1" : "v2");
  }, []);

  const getSoundFile = () => {
    if (!selectedVersion) return countdown30v1;
    switch (quiz.type) {
      case "C":
        return selectedVersion === "v1" ? countdown30v1 : countdown30v2;
      case "B":
        return selectedVersion === "v1" ? countdown20v1 : countdown20v2;
      case "A":
        return selectedVersion === "v1" ? countdown10v1 : countdown10v2;
      default:
        return countdown30v1;
    }
  };

  useEffect(() => {
    if (selectedVersion && !hasMedia) {
      const soundFile = getSoundFile();
      countdownAudioRef.current = new Audio(soundFile);
      countdownAudioRef.current.loop = true;
      countdownAudioRef.current.volume = 1;

      answerAudioRef.current = new Audio(answerSound);
      answerAudioRef.current.volume = 1;

      return () => {
        countdownAudioRef.current?.pause();
        answerAudioRef.current?.pause();
      };
    }

    if (selectedVersion) {
      answerAudioRef.current = new Audio(answerSound);
      answerAudioRef.current.volume = 1;

      return () => {
        answerAudioRef.current?.pause();
      };
    }
  }, [quiz.type, selectedVersion, hasMedia]);

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
        quizStarted();
      }, 3000);
      return () => clearTimeout(introTimer);
    }
  }, [isLoading]);

  useEffect(() => {
    if (
      !hasMedia &&
      countdownAudioRef.current &&
      !showQuestionIntro &&
      !isLoading &&
      !showResults
    ) {
      countdownAudioRef.current
        .play()
        .catch((e) => console.log("Countdown audio play failed:", e));
    } else {
      countdownAudioRef.current?.pause();
      if (showResults && countdownAudioRef.current) {
        countdownAudioRef.current.currentTime = 0;
      }
    }
  }, [isLoading, showResults, showQuestionIntro, mediaLoaded, hasMedia]);

  useEffect(() => {
    if (showResults && answerAudioRef.current && !hasMedia) {
      countdownAudioRef.current?.pause();
      if (countdownAudioRef.current) {
        countdownAudioRef.current.currentTime = 0;
      }

      answerAudioRef.current.currentTime = 0;
      answerAudioRef.current
        .play()
        .catch((e) => console.log("Answer audio play failed:", e));
    }
  }, [showResults]);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (!isLoading && !showQuestionIntro && (!hasMedia || mediaLoaded)) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            setShowResults(true);
            onTimeUp();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isLoading, showQuestionIntro, mediaLoaded, hasMedia]);

  const isCorrectAnswer = (answer) => answer.includes("**");
  const cleanAnswerText = (answer) => answer.replace(/\*\*/g, "");

  const handleMediaLoaded = () => {
    setMediaLoaded(true);
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
    <div className="projector-question-container">
      <div className="projector-question">
        {!showResults && (
          <div className="timer-container">
            <div className="timer-circle">
              <span className="timer-text">{timeLeft}</span>
            </div>
          </div>
        )}

        {hasMedia && (
          <QuizMediaPlayer
            mediaUrl={quiz.mediaUrl}
            onMediaLoaded={handleMediaLoaded}
            showLoading={!mediaLoaded}
          />
        )}

        <>
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
                    <span className="result-indicator">
                      {correct ? "✓" : "✗"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </>
      </div>

      <GroupsAnsweredList groupsAnswered={playersAnswered} />
    </div>
  );
};

export default ProjectorQuestion;
