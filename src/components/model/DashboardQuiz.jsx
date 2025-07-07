import '../../style/model/DashboardQuiz.scss';

const DashboardQuiz = ({ quiz, index }) => {
    return (
        <div className="dashboard-quiz">
            <p>{quiz.type}.{index + 1}</p>
        </div>
    );
}

export default DashboardQuiz;