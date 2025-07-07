import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import '../../style/model/Question.scss';

const Question = ({ quiz, onBack }) => {
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        const splitedAnswers = quiz.answer.split(', ');
        setAnswers(splitedAnswers);
    }, [quiz.answer]);

    const isCorrectAnswer = (answer) => {
        return answer.includes('**');
    };

    const cleanAnswerText = (answer) => {
        return answer.replace(/\*\*/g, '');
    };

    return (
        <div className="question">
            <button className="back-button" onClick={onBack}>
                <FaArrowLeft className="back-icon" />
            </button>
            <h1>{quiz.question}</h1>
            <div className="answers-grid">
                {answers.map((answer, index) => {
                    const correct = isCorrectAnswer(answer);
                    return (
                        <div 
                            key={index} 
                            className={`answer-option ${correct ? 'correct-answer' : ''}`}
                            data-correct={correct}
                        >
                            {cleanAnswerText(answer)}
                            {correct && (
                                <span className="correct-badge">Correct</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Question;