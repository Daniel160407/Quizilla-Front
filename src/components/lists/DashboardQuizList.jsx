import { useEffect, useState } from "react";
import DashboardQuiz from "../model/DashboardQuiz";
import "../../style/lists/DashboardQuizList.scss";

const DashboardQuizList = ({ quizzes }) => {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    const uniqueTypes = [...new Set(quizzes.map((quiz) => quiz.type))];
    setTypes(uniqueTypes);
  }, [quizzes]);

  return (
    <div className="dashboard-quiz-list">
      {types.map((type, index) => (
        <div key={type} className={type} style={{ "--index": index }}>
          <h1>{type}</h1>
          <div className="category-quizzes">
            {quizzes
              .filter((quiz) => quiz.type === type)
              .map((quiz, index) => (
                <DashboardQuiz quiz={quiz} index={index} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardQuizList;
