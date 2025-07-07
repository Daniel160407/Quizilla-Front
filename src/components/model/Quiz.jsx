const Quiz = ({ quiz }) => {
    return (
        <div className="quiz">
            <p>{quiz.type} - {quiz.points}</p>
        </div>
    );
}

export default Quiz;