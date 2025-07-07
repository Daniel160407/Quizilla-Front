import { useEffect, useState } from "react";
import Quiz from "../model/Quiz";

const QuizList = ({ quizzes }) => {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    const uniqueTypes = [...new Set(quizzes.map((quiz) => quiz.type))];
    setTypes(uniqueTypes);
  }, [quizzes]);

  return (
    <div className="quizzes">
      {types.map((type) => (
        <div key={type} className={type}>
          <h1>{type}</h1>
          {quizzes
            .filter((quiz) => quiz.type === type)
            .map((quiz) => (
              <Quiz key={quiz.id} quiz={quiz} />
            ))}
        </div>
      ))}
    </div>
  );
};

export default QuizList;
