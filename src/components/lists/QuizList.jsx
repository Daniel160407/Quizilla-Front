import { useEffect, useState } from "react";
import Quiz from "../model/Quiz";
import "../../style/lists/QuizList.scss";
import useAxios from "../hooks/UseAxios";

const QuizList = ({ quizzes, onEdit, onDelete }) => {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    const uniqueTypes = [...new Set(quizzes.map((quiz) => quiz.type))];
    setTypes(uniqueTypes);
  }, [quizzes]);

  return (
    <div className="quiz-list">
      {types.map((type, index) => (
        <div key={type} className={type} style={{ "--index": index }}>
          <h1>{type}</h1>
          {quizzes
            .filter((quiz) => quiz.type === type)
            .map((quiz, index) => (
              <Quiz
                key={quiz.id}
                quiz={quiz}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
                types={types}
              />
            ))}
        </div>
      ))}
    </div>
  );
};

export default QuizList;
