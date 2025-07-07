import '../../style/uiComponents/AddQuizBtn.scss';

const AddQuizBtn = ({ onClick }) => {
    return (
        <div className="addQuiz" onClick={onClick}>
            <p>Add Quiz</p>
        </div>
    );
}

export default AddQuizBtn;